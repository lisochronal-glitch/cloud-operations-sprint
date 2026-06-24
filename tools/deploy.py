import os
import boto3
import datetime

bucket_name = "john-trollinski-cloud-portfolio"
cloud_id = "E2H6IDE9B5VP3Y"
website_folder = "/home/johnj/projects/cloud-operations-sprint/website"
upload_success = True

content_types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript"
}

list_of_files = os.listdir(website_folder)
s3 = boto3.client("s3")

print("Files found in website folder:")
for file in list_of_files:
    try:
        full_path = os.path.join(website_folder, file)
        extension = os.path.splitext(file)[1]
        content_type = content_types.get(extension, "application/octet-stream")
        s3.upload_file(full_path, bucket_name, file, ExtraArgs={"ContentType": content_type})
        print(f"Uploaded: {file} ({content_type})")
    except Exception as error:
        print(f"Upload failed: {error}")
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
            "CallerReference": f"python-auto-deploy-{datetime.datetime.now()}"
        
        })
        print(f"Cache invalidated: {response['Invalidation']['Id']}")
    except Exception as error:
        print(f"Invalidation failed: {error}")    
else: 
    print("Skipped invalidating cache due to upload failures")