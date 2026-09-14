import json
import os
from datetime import datetime, timezone

import boto3


ses = boto3.client("ses")

FROM_EMAIL = os.environ["FROM_EMAIL"]
TO_EMAIL = os.environ["TO_EMAIL"]


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def parse_sqs_body(body: str) -> dict:
    message = json.loads(body)

    if "Message" in message and isinstance(message["Message"], str):
        return json.loads(message["Message"])

    return message


def build_email_body(order_event: dict) -> str:
    order_id = order_event.get("orderId", "unknown-order-id")
    order_status = order_event.get("orderStatus", "UNKNOWN")
    background_status = order_event.get("backgroundStatus", "UNKNOWN")
    created_at = order_event.get("createdAt", "unknown-created-time")

    return f"""Project 3 demo order notification

A demo order event was received by the notification branch.

Order ID: {order_id}
Order status: {order_status}
Background status at publish time: {background_status}
Created at: {created_at}

This email was sent by:
SNS → SQS notification queue → Lambda → Amazon SES

Timestamp: {utc_now()}
"""


def send_order_email(order_event: dict) -> dict:
    order_id = order_event.get("orderId", "unknown-order-id")

    return ses.send_email(
        Source=FROM_EMAIL,
        Destination={
            "ToAddresses": [
                TO_EMAIL
            ]
        },
        Message={
            "Subject": {
                "Data": f"Project 3 demo order confirmed: {order_id}",
                "Charset": "UTF-8"
            },
            "Body": {
                "Text": {
                    "Data": build_email_body(order_event),
                    "Charset": "UTF-8"
                }
            }
        }
    )


def lambda_handler(event, context):
    print(f"Received SQS notification event with {len(event.get('Records', []))} record(s).")

    sent_messages = []

    for record in event.get("Records", []):
        sqs_message_id = record.get("messageId", "unknown-message-id")
        body = record["body"]

        print(
            json.dumps(
                {
                    "message": "Processing notification queue message.",
                    "sqsMessageId": sqs_message_id,
                    "body": body
                }
            )
        )

        order_event = parse_sqs_body(body)

        print(
            json.dumps(
                {
                    "message": "Parsed notification order event.",
                    "sqsMessageId": sqs_message_id,
                    "orderId": order_event.get("orderId")
                }
            )
        )

        ses_result = send_order_email(order_event)

        sent_message = {
            "orderId": order_event.get("orderId"),
            "sqsMessageId": sqs_message_id,
            "sesMessageId": ses_result.get("MessageId")
        }

        print(
            json.dumps(
                {
                    "message": "SES notification email sent.",
                    **sent_message
                }
            )
        )

        sent_messages.append(sent_message)

    return {
        "statusCode": 200,
        "sentMessages": sent_messages
    }