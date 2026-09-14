import json
import os
import uuid
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError


dynamodb = boto3.resource("dynamodb")
sns = boto3.client("sns")

ORDERS_TABLE = os.environ["ORDERS_TABLE"]
ORDER_EVENTS_TOPIC_ARN = os.environ["ORDER_EVENTS_TOPIC_ARN"]
CUSTOMER_EMAIL = os.environ.get("CUSTOMER_EMAIL", "demo-recipient-not-configured@example.com")

orders_table = dynamodb.Table(ORDERS_TABLE)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        "body": json.dumps(body)
    }


def parse_payload(event: dict) -> dict:
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {"optionsRequest": True}

    body = event.get("body")

    if body:
        if event.get("isBase64Encoded"):
            raise ValueError("Base64 encoded requests are not supported in this demo.")
        return json.loads(body)

    return event


def lambda_handler(event, context):
    try:
        payload = parse_payload(event)

        if payload.get("optionsRequest"):
            return response(200, {"message": "CORS preflight OK"})

        now = utc_now()

        order_id = payload.get("orderId") or f"ORD-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:8].upper()}"
        idempotency_key = payload.get("idempotencyKey") or order_id

        customer_email = payload.get("customerEmail") or CUSTOMER_EMAIL

        items = payload.get("items") or [
            {
                "name": "Demo SaaS order",
                "quantity": 1
            }
        ]

        order_record = {
            "orderId": order_id,
            "idempotencyKey": idempotency_key,
            "orderStatus": "CONFIRMED",
            "backgroundStatus": "PENDING",
            "customerEmail": customer_email,
            "items": items,
            "createdAt": now,
            "updatedAt": now
        }

        try:
            orders_table.put_item(
                Item=order_record,
                ConditionExpression="attribute_not_exists(orderId)"
            )
            duplicate = False

        except ClientError as error:
            if error.response["Error"]["Code"] != "ConditionalCheckFailedException":
                raise

            existing = orders_table.get_item(
                Key={
                    "orderId": order_id
                }
            ).get("Item", {})

            return response(
                200,
                {
                    "message": "Duplicate order request detected. Existing order was not published again.",
                    "orderId": order_id,
                    "duplicate": True,
                    "orderStatus": existing.get("orderStatus"),
                    "backgroundStatus": existing.get("backgroundStatus")
                }
            )

        order_event = {
            "eventType": "ORDER_CONFIRMED",
            "source": "project3-order-publisher",
            "orderId": order_id,
            "idempotencyKey": idempotency_key,
            "orderStatus": "CONFIRMED",
            "backgroundStatus": "PENDING",
            "customerEmail": customer_email,
            "items": items,
            "createdAt": now
        }

        publish_result = sns.publish(
            TopicArn=ORDER_EVENTS_TOPIC_ARN,
            Message=json.dumps(order_event),
            MessageAttributes={
                "eventType": {
                    "DataType": "String",
                    "StringValue": "ORDER_CONFIRMED"
                },
                "orderId": {
                    "DataType": "String",
                    "StringValue": order_id
                }
            }
        )

        return response(
            200,
            {
                "message": "Demo order confirmed and published to the event workflow.",
                "orderId": order_id,
                "duplicate": duplicate,
                "orderStatus": "CONFIRMED",
                "backgroundStatus": "PENDING",
                "snsMessageId": publish_result["MessageId"]
            }
        )

    except Exception as error:
        print(f"ERROR: {error}")
        return response(
            500,
            {
                "message": "Failed to publish demo order.",
                "error": str(error)
            }
        )