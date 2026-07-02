# Event-Driven Notification Workflow

This project will demonstrate an AWS event-driven workflow for a small SaaS-style application.

## Scenario

A SaaS application needs to process notification events without making the main application wait for the work to finish.

Example events could include user signup notifications, payment status updates, account activity notifications, or message delivery requests.

## Planned Architecture

Application event -> SNS Topic -> SQS processing queue -> Lambda processor -> CloudWatch Logs

SNS fanout -> SQS audit queue

Failure path -> SQS processing queue -> dead-letter queue

## Planned AWS Services

- Amazon SNS
- Amazon SQS
- AWS Lambda
- Dead-letter queue
- CloudWatch Logs
- CloudWatch Metrics
- IAM
- CloudFormation

## Status

Planned.
