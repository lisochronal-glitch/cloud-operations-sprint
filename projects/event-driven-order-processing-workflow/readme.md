# Asynchronous SaaS Order Processing Workflow

This project demonstrates an event-driven order processing workflow on AWS.

A public portfolio page creates a demo order through API Gateway. The backend stores the order state in DynamoDB, publishes an order event to SNS, processes the event asynchronously through SQS and Lambda, and returns the updated order status to the frontend.

The goal is to show a realistic cloud operations pattern: accept a user-facing request quickly, move slower background work into an asynchronous workflow, track state, handle failures with a dead-letter queue, and protect the public entry point with monitoring and automatic containment.

## Architecture

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

Because the project exposes a public API endpoint, the public publisher Lambda is monitored with a CloudWatch alarm.

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

## Evidence captured

Evidence was captured separately for:

- Live project page creating a demo order.
- API Gateway returning successful POST /orders and GET /orders/{orderId} responses.
- DynamoDB item moving from PENDING to COMPLETED.
- Processor Lambda CloudWatch logs.
- DLQ test message and retry behavior.
- SES email delivery proof.
- CloudWatch alarm and emergency disable safety mechanism.

Screenshots can be added to this folder later if needed.
