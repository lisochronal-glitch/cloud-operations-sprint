import json
from datetime import datetime, timezone

import boto3


lambda_client = boto3.client("lambda")

TARGET_FUNCTION_NAME = "project3-order-publisher"


def lambda_handler(event, context):
    now = datetime.now(timezone.utc).isoformat()

    print(
        json.dumps(
            {
                "message": "Emergency disable Lambda invoked.",
                "targetFunction": TARGET_FUNCTION_NAME,
                "triggerEvent": event,
                "timestamp": now
            }
        )
    )

    lambda_client.put_function_concurrency(
        FunctionName=TARGET_FUNCTION_NAME,
        ReservedConcurrentExecutions=0
    )

    result = {
        "message": "Public demo publisher Lambda disabled.",
        "targetFunction": TARGET_FUNCTION_NAME,
        "reservedConcurrency": 0,
        "timestamp": now
    }

    print(json.dumps(result))

    return result