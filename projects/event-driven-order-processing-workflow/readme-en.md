# Asynchronous SaaS Order Processing Workflow

[日本語版](readme.md)

This project demonstrates an event-driven order processing workflow on AWS.

A public portfolio page creates a demo order through API Gateway. The backend stores the order state in DynamoDB, publishes an order event to SNS, processes the event asynchronously through SQS and Lambda, and returns the updated order status to the frontend.

The goal is to show a realistic cloud operations pattern: accept a user-facing request quickly, move slower background work into an asynchronous workflow, track state, handle failures with a dead-letter queue, and protect the public entry point with monitoring and automatic containment.

Live demo:

https://d1rzzxjs182iar.cloudfront.net/projects/event-driven-order-processing-workflow/index.html

## Architecture

![Asynchronous SaaS order processing workflow architecture](../../website/projects/event-driven-order-processing-workflow/asynchronous-saas-order-processing-workflow.png)

Normal order workflow:

    CloudFront portfolio page
      -> API Gateway HTTP API
      -> Publisher Lambda
      -> DynamoDB order record
      -> SNS order event topic
      -> SQS processing queue
      -> Processor Lambda
      -> DynamoDB status update

Status lookup workflow:

    CloudFront portfolio page
      -> API Gateway HTTP API
      -> Status Lambda
      -> DynamoDB status read

Additional branches and controls:

    SNS order event topic
      -> SQS audit queue

    SNS order event topic
      -> SQS notification queue
      -> Notifier Lambda
      -> Amazon SES
      -> Verified email address
      -> Disabled after proof test

    SQS processing queue
      -> retry attempts
      -> dead-letter queue

    CloudWatch alarm
      -> SNS safety alert topic
      -> email notification
      -> emergency disable Lambda
      -> reserved concurrency on public publisher Lambda set to 0

## AWS services used

- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon SNS
- Amazon SQS
- Amazon SES
- Amazon CloudWatch
- AWS CloudTrail
- AWS IAM
- Amazon CloudFront

## What the demo does

The live project page includes a test button that creates a demo order.

When the button is clicked:

1. The browser sends a POST /orders request to API Gateway.
2. API Gateway invokes project3-order-publisher.
3. The publisher Lambda writes an order item to DynamoDB with backgroundStatus = PENDING.
4. The publisher Lambda publishes an ORDER_CONFIRMED event to SNS.
5. SNS fans the event out to SQS queues.
6. The processing queue invokes project3-order-processor.
7. The processor Lambda updates the DynamoDB item to backgroundStatus = COMPLETED.
8. The frontend polls GET /orders/{orderId} through API Gateway.
9. The status Lambda reads DynamoDB and returns the current order status.
10. The page displays the completed background workflow.

## Main resources

| Resource | Name |
|---|---|
| DynamoDB table | project3-orders |
| SNS topic | project3-order-events |
| Processing queue | project3-order-processing-queue |
| Audit queue | project3-order-audit-queue |
| Notification queue | project3-order-notification-queue |
| Dead-letter queue | project3-order-dlq |
| Publisher Lambda | project3-order-publisher |
| Processor Lambda | project3-order-processor |
| Status Lambda | project3-order-status |
| Notifier Lambda | project3-order-notifier |
| Emergency Lambda | project3-emergency-disable-demo |
| HTTP API | project3-order-workflow-api |

## Failure handling

The processing queue is configured with a dead-letter queue.

If the processor Lambda fails to process a message repeatedly, the message is not deleted from the queue. SQS retries delivery. After the configured receive limit is reached, SQS moves the message to project3-order-dlq.

This was verified with a deliberate poison test message containing:

    {
      "orderId": "ORD-DLQ-TEST-001",
      "simulateFailure": true
    }

The processor Lambda raised an intentional error, the message was retried, and the failed message was moved to the dead-letter queue.

## Notification branch

A notification branch was implemented and verified using Amazon SES:

    SNS topic
      -> SQS notification queue
      -> Notifier Lambda
      -> Amazon SES
      -> verified email inbox

The branch successfully sent a test email for:

    ORD-SES-TEST-001

After verification, the notification branch was disconnected from the public demo to avoid sending unnecessary emails every time a visitor clicks the demo button.

This is the intended final state: the notification path was implemented and proven, but it is not left active for public traffic.

## Operational safety

Because the project exposes a public, unauthenticated API endpoint, it uses two
independent controls: a request rate limit that reduces traffic reaching the
workflow, and an alarm-driven kill switch that contains elevated invocations.

### Request throttling

API Gateway route throttling on the `$default` stage is configured with:

    Rate limit:  2 requests per second
    Burst limit: 5 requests

A visitor clicking the demo button generates roughly one request every few
seconds, so this allows ordinary demo use while restricting scripted abuse.
Throttling was chosen as the first line of defence because it is free to
configure and reduces downstream work before the alarm needs to react: limiting
accepted requests reduces Lambda invocations, SNS publishes, SQS messages, and
DynamoDB writes together. API Gateway throttling is best effort, not a guaranteed
request ceiling or spending cap. See the [AWS throttling documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html).

AWS WAF was considered and rejected. It offers richer rule matching, but carries
a monthly charge that is not justified for a portfolio demo whose realistic
threat is a visitor running a loop, not a targeted attack.

This throttling was configured manually through the AWS CLI. It is not covered
by infrastructure as code in this repository.

### Monitoring and containment

Throttling limits the rate, but not the duration. The publisher Lambda is
therefore also monitored with a CloudWatch alarm.

Safety control:

    Metric: project3-order-publisher Invocations
    Threshold: greater than 50 invocations in 5 minutes
    Action 1: send email notification
    Action 2: invoke emergency disable Lambda

The emergency Lambda calls PutFunctionConcurrency and sets reserved concurrency on project3-order-publisher to 0.

This immediately throttles the public order creation function if abnormal traffic is detected. The function can be manually re-enabled later by removing or changing the reserved concurrency setting.

This control is intentionally simple, but it demonstrates operational foresight: public cloud entry points should have monitoring, alerting, and containment.

## IAM design

Each Lambda function uses its own execution role with only the permissions required for its job.

Examples:

- The publisher Lambda can write to the order table and publish to SNS.
- The processor Lambda can read from the processing queue and update DynamoDB.
- The status Lambda can read from DynamoDB.
- The notifier Lambda can read from the notification queue and send email through SES.
- The emergency Lambda can only change concurrency on the public publisher Lambda.

This keeps permissions scoped to the function’s responsibility.

## Cost and cleanup notes

The project is designed to stay very low cost:

- Lambda usage is minimal.
- DynamoDB uses small test items.
- SQS and SNS traffic are tiny.
- SES was tested once and then disconnected from the public demo.
- CloudWatch monitoring is used for operational visibility.
- AWS Budgets remain active as a cost-level safety net.

The public demo remains active, but the SES notification branch is disabled to prevent unnecessary email sends.

## Evidence

### Live workflow completion

The live portfolio page creates an order through API Gateway and displays the completed asynchronous workflow.

![Live project page showing a completed order workflow](evidence/live-demo-completed-order.png)

### DynamoDB order state

The stored order record shows the confirmed order state, completed background processing, idempotency key, processor function, and processing timestamps.

![DynamoDB order item showing completed background processing](evidence/dynamodb-completed-order.png)

### Dead-letter queue verification

A deliberate poison message was retried repeatedly and moved to the configured dead-letter queue.

![Failed message present in the dead-letter queue after retries](evidence/dlq-message-after-retries.png)

The test payload explicitly enabled simulated processing failure.

![Poison message payload with simulated failure enabled](evidence/dlq-simulated-failure-payload.png)

### SES notification branch

The notification branch successfully delivered a confirmation email through SNS, SQS, Lambda, and Amazon SES before being disconnected from the public demo.

![Delivered Amazon SES confirmation email](evidence/ses-confirmation-email.png)

### Public demo safety controls

A CloudWatch alarm monitors invocation volume on the public publisher Lambda.

![CloudWatch publisher invocation safety alarm](evidence/cloudwatch-publisher-safety-alarm.png)

The alarm publishes to an SNS safety topic with confirmed email and Lambda subscribers.

![SNS safety topic subscriptions](evidence/sns-safety-alert-subscriptions.png)

The emergency Lambda disables the public publisher by setting its reserved concurrency to zero.

![Emergency Lambda disabling the public publisher](evidence/emergency-lambda-disables-publisher.png)
