import json
import os
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError


dynamodb = boto3.resource("dynamodb")

ORDERS_TABLE = os.environ["ORDERS_TABLE"]
orders_table = dynamodb.Table(ORDERS_TABLE)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def parse_sqs_body(body: str) -> dict:
    """
    Supports both:
    1. Raw SNS delivery enabled:
       body = {"eventType": "...", "orderId": "..."}

    2. Raw SNS delivery disabled:
       body = {"Type": "Notification", "Message": "{\"eventType\":\"...\"}"}
    """
    message = json.loads(body)

    if "Message" in message and isinstance(message["Message"], str):
        return json.loads(message["Message"])

    return message


def process_order_event(order_event: dict, sqs_message_id: str) -> None:
    order_id = order_event.get("orderId")

    if not order_id:
        raise ValueError("Order event is missing orderId.")

    if order_event.get("simulateFailure") is True:
        raise RuntimeError(f"Simulated processing failure for orderId={order_id}")

    now = utc_now()

    try:
        update_result = orders_table.update_item(
            Key={
                "orderId": order_id
            },
            ConditionExpression="attribute_exists(orderId)",
            UpdateExpression=(
                "SET backgroundStatus = :completed, "
                "processedAt = :processedAt, "
                "updatedAt = :updatedAt, "
                "processorFunction = :processorFunction, "
                "lastProcessedMessageId = :lastProcessedMessageId"
            ),
            ExpressionAttributeValues={
                ":completed": "COMPLETED",
                ":processedAt": now,
                ":updatedAt": now,
                ":processorFunction": "project3-order-processor",
                ":lastProcessedMessageId": sqs_message_id
            },
            ReturnValues="UPDATED_NEW"
        )

        print(
            json.dumps(
                {
                    "message": "Order background processing completed.",
                    "orderId": order_id,
                    "updatedAttributes": update_result.get("Attributes", {})
                }
            )
        )

    except ClientError as error:
        if error.response["Error"]["Code"] == "ConditionalCheckFailedException":
            raise ValueError(
                f"Order {order_id} does not exist in DynamoDB. Message cannot be processed."
            )

        raise


def lambda_handler(event, context):
    print(f"Received SQS event with {len(event.get('Records', []))} record(s).")

    for record in event.get("Records", []):
        sqs_message_id = record.get("messageId", "unknown-message-id")
        body = record["body"]

        print(
            json.dumps(
                {
                    "message": "Processing SQS message.",
                    "sqsMessageId": sqs_message_id,
                    "body": body
                }
            )
        )

        order_event = parse_sqs_body(body)

        print(
            json.dumps(
                {
                    "message": "Parsed order event.",
                    "sqsMessageId": sqs_message_id,
                    "orderEvent": order_event
                }
            )
        )

        process_order_event(order_event, sqs_message_id)

    return {
        "statusCode": 200,
        "processedRecords": len(event.get("Records", []))
    }