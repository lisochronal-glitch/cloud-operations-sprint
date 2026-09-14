import datetime
import mimetypes
import os
import sys
from pathlib import Path

import boto3

BUCKET_NAME = os.environ.get("PORTFOLIO_BUCKET", "john-trollinski-cloud-portfolio")
DISTRIBUTION_ID = os.environ.get("CLOUDFRONT_DISTRIBUTION_ID", "E2H6IDE9B5VP3Y")

script_path = Path(__file__).resolve()
project_root = script_path.parent.parent
website_folder = project_root / "website"

CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
    ".txt": "text/plain; charset=utf-8",
    ".woff2": "font/woff2",
}

# HTML is revalidated on every request so a deploy is visible immediately.
# Static assets are cached longer; the invalidation below handles updates.
CACHE_CONTROL = {
    ".html": "no-cache",
    ".pdf": "public, max-age=3600",
}
DEFAULT_CACHE_CONTROL = "public, max-age=86400"


def main() -> int:
    if not website_folder.is_dir():
        print(f"ERROR: website folder not found at {website_folder}")
        return 1

    s3 = boto3.client("s3")
    uploaded = 0
    failures = []

    print(f"Deploying {website_folder} -> s3://{BUCKET_NAME}")

    for file_path in sorted(website_folder.rglob("*")):
        if not file_path.is_file():
            continue
        if file_path.name in {".DS_Store", "Thumbs.db"}:
            continue

        s3_key = file_path.relative_to(website_folder).as_posix()
        extension = file_path.suffix.lower()
        content_type = CONTENT_TYPES.get(extension) or (
            mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        )
        cache_control = CACHE_CONTROL.get(extension, DEFAULT_CACHE_CONTROL)

        try:
            s3.upload_file(
                str(file_path),
                BUCKET_NAME,
                s3_key,
                ExtraArgs={
                    "ContentType": content_type,
                    "CacheControl": cache_control,
                },
            )
            uploaded += 1
            print(f"  uploaded: {s3_key} ({content_type})")
        except Exception as error:
            print(f"  FAILED:   {s3_key}: {error}")
            failures.append(s3_key)

    if failures:
        print(f"\n{len(failures)} upload(s) failed. Skipping CloudFront invalidation.")
        for key in failures:
            print(f"  - {key}")
        return 1

    if uploaded == 0:
        print("\nERROR: no files uploaded. Refusing to invalidate.")
        return 1

    print(f"\n{uploaded} file(s) uploaded. Creating CloudFront invalidation...")

    cloudfront = boto3.client("cloudfront")
    try:
        response = cloudfront.create_invalidation(
            DistributionId=DISTRIBUTION_ID,
            InvalidationBatch={
                "Paths": {"Quantity": 1, "Items": ["/*"]},
                "CallerReference": f"deploy-{datetime.datetime.now(datetime.timezone.utc).isoformat()}",
            },
        )
        print(f"Cache invalidated: {response['Invalidation']['Id']}")
    except Exception as error:
        print(f"ERROR: invalidation failed: {error}")
        return 1

    print("Deployment complete.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
