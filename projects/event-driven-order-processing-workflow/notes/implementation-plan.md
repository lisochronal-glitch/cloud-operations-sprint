# Implementation Plan

## Project

Asynchronous SaaS Order Processing Workflow

## Business Problem

A SaaS company needs to accept customer orders quickly while slower follow-up work, such as confirmation processing, audit logging, internal workflow handling, and failure handling, happens reliably in the background.

## AWS Architecture

Project page
  ↓
API Gateway
  ↓
Publisher Lambda
  ↓
DynamoDB: order status = ACCEPTED
  ↓
SNS Topic
  ├── SQS processing queue → Processor Lambda → DynamoDB: order status = PROCESSED
  └── SQS audit queue

Failure path:
SQS processing queue
  ↓
Dead-letter queue

Visibility:
CloudWatch Logs and metrics

## Build Order

1. Create DynamoDB table for order status.
2. Create SNS topic.
3. Create SQS processing queue.
4. Create SQS audit queue.
5. Create SQS dead-letter queue.
6. Create Publisher Lambda.
7. Create Processor Lambda.
8. Connect SNS to both SQS queues.
9. Connect processing queue to Processor Lambda.
10. Create API Gateway endpoint for the project page.
11. Test order creation.
12. Test async processing.
13. Test failure and DLQ behavior.
14. Capture evidence screenshots.
15. Add live demo button to the project page.
