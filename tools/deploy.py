import datetime
from pathlib import Path

import boto3

bucket_name = "john-trollinski-cloud-portfolio"
cloud_id = "E2H6IDE9B5VP3Y"
upload_success = True

script_path = Path(__file__).resolve()
tools_folder = script_path.parent
project_root = tools_folder.parent
website_folder = project_root / "website"

content_types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
}

s3 = boto3.client("s3")

print("Files found in website folder:")

for file_path in website_folder.rglob("*"):
    if not file_path.is_file():
        continue

    try:
        # Preserve website folder structure in S3
        s3_key = file_path.relative_to(website_folder).as_posix()

        extension = file_path.suffix.lower()
        content_type = content_types.get(extension, "application/octet-stream")

        s3.upload_file(
            str(file_path),
            bucket_name,
            s3_key,
            ExtraArgs={"ContentType": content_type}
        )

        print(f"Uploaded: {s3_key} ({content_type})")

    except Exception as error:
        print(f"Upload failed for {file_path}: {error}")
        upload_success = False

if upload_success:
    cloudfront = boto3.client("cloudfront")

    try:
        response = cloudfront.create_invalidation(
            DistributionId=cloud_id,
            InvalidationBatch={
                "Paths": {
                    "Quantity": 1,
                    "Items": ["/*"]
                },
                "CallerReference": f"python-auto-deploy-{datetime.datetime.now().isoformat()}"
            }
        )

        print(f"Cache invalidated: {response['Invalidation']['Id']}")

    except Exception as error:
        print(f"Invalidation failed: {error}")

else:
    print("Skipped invalidating cache due to upload failures")