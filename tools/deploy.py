import os
import boto3
import datetime

bucket_name = "john-trollinski-cloud-portfolio"
bucket_arn = "arn:aws:s3:::john-trollinski-cloud-portfolio"
cloud_id = "E2H6IDE9B5VP3Y"
website_folder = "/home/johnj/projects/cloud-operations-sprint/website"
list_of_files = os.listdir(website_folder)

s3 = boto3.client("s3")

for file in list_of_files:
    full_path = os.path.join(website_folder, file)
    s3.upload_file(full_path, bucket_name, file)
    print (f"Uploaded: {file}")

cloudfront = boto3.client("cloudfront")

cloudfront.create_invalidation(
    DistributionId=cloud_id,
    InvalidationBatch={
        "Paths": {
            "Quantity": 1,
            "Items": ["/*"]
        },
        "CallerReference": f"python-auto-deploy-{datetime.datetime.now()}"
    }
)
