import json
import os
from decimal import Decimal

import boto3


dynamodb = boto3.resource("dynamodb")

ORDERS_TABLE = os.environ["ORDERS_TABLE"]
orders_table = dynamodb.Table(ORDERS_TABLE)


def json_default(value):
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)

    raise TypeError(f"Object of type {type(value)} is not JSON serializable")


def response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            # The HTTP API's CORS configuration is authoritative; API Gateway
            # ignores these legacy backend CORS headers for requests through it.
            "Access-Control-Allow-Origin": "https://d1rzzxjs182iar.cloudfront.net",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        "body": json.dumps(body, default=json_default)
    }


def lambda_handler(event, context):
    try:
        if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
            return response(200, {"message": "CORS preflight OK"})

        path_parameters = event.get("pathParameters") or {}
        order_id = path_parameters.get("orderId")

        if not order_id:
            query_parameters = event.get("queryStringParameters") or {}
            order_id = query_parameters.get("orderId")

        if not order_id:
            return response(
                400,
                {
                    "message": "Missing orderId."
                }
            )

        result = orders_table.get_item(
            Key={
                "orderId": order_id
            }
        )

        item = result.get("Item")

        if not item:
            return response(
                404,
                {
                    "message": "Order not found.",
                    "orderId": order_id
                }
            )

        return response(
            200,
            {
                "message": "Order status retrieved.",
                "orderId": item.get("orderId"),
                "orderStatus": item.get("orderStatus"),
                "backgroundStatus": item.get("backgroundStatus"),
                "createdAt": item.get("createdAt"),
                "updatedAt": item.get("updatedAt"),
                "processedAt": item.get("processedAt")
            }
        )

    except Exception as error:
        print(f"ERROR: {error}")
        return response(
            500,
            {
                "message": "Failed to retrieve order status.",
                "error": str(error)
            }
        )