import os
import json
import hashlib
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError


dynamodb = boto3.resource("dynamodb")

TABLE_NAME = os.environ["TABLE_NAME"]
HASH_SALT = os.environ["HASH_SALT"]

table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    source_ip = event.get("sourceIp")

    if not source_ip:
        source_ip = (
            event.get("requestContext", {})
            .get("http", {})
            .get("sourceIp")
        )

    if not source_ip:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "error": "No source IP found"
            })
        }

    visitor_hash = hashlib.sha256(
        f"{HASH_SALT}:{source_ip}".encode("utf-8")
    ).hexdigest()

    now = datetime.now(timezone.utc).isoformat()

    is_new_visitor = False

    try:
        table.put_item(
            Item={
                "visitor_hash": visitor_hash,
                "first_seen": now,
                "last_seen": now,
                "visit_count": 1
            },
            ConditionExpression="attribute_not_exists(visitor_hash)"
        )
        is_new_visitor = True

    except ClientError as error:
        if error.response["Error"]["Code"] != "ConditionalCheckFailedException":
            raise

        table.update_item(
            Key={
                "visitor_hash": visitor_hash
            },
            UpdateExpression="""
                SET last_seen = :now,
                    visit_count = visit_count + :one
            """,
            ExpressionAttributeValues={
                ":now": now,
                ":one": 1
            }
        )

    unique_increment = 1 if is_new_visitor else 0

    stats_response = table.update_item(
        Key={
            "visitor_hash": "__stats__"
        },
        UpdateExpression="""
            SET last_updated = :now
            ADD total_visits :one,
                unique_visitors :unique_increment
        """,
        ExpressionAttributeValues={
            ":now": now,
            ":one": 1,
            ":unique_increment": unique_increment
        },
        ReturnValues="UPDATED_NEW"
    )

    stats = stats_response["Attributes"]

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "message": "Visit recorded",
            "total_visits": int(stats["total_visits"]),
            "unique_visitors": int(stats["unique_visitors"])
        })
    }