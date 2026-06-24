# Cloud Operations Portfolio

A practical AWS / cloud operations portfolio project built to demonstrate cloud deployment, Linux workflow, Git/GitHub usage, IAM permissions, documentation, and operational troubleshooting.

Live site:

https://d1rzzxjs182iar.cloudfront.net

## Project Overview

This project is a bilingual portfolio site deployed on AWS. The goal is to build a small but real cloud-hosted system while documenting the workflow clearly through Git history, project notes, and visible deployment progress.

The site is built with vanilla HTML, CSS, and JavaScript. It includes English/Japanese language switching, certification verification links, and a build status section showing current project progress.

The project is also used as a practical operations lab: deployment, permissions, cache invalidation, account security, and operational guardrails are intentionally documented as part of the build.

## Current Architecture

* Static site files are stored in a private Amazon S3 bucket.
* CloudFront provides the public HTTPS endpoint.
* The S3 bucket is not publicly exposed.
* CloudFront is allowed to read from the private S3 bucket through the bucket policy.
* CloudFront caching remains enabled for normal operation.
* When files are updated in S3, a one-time CloudFront invalidation is created to refresh the deployed site.

## Hosting Decision

S3 static website hosting is intentionally disabled for this project.

This site is delivered through CloudFront using a private S3 bucket as the origin. This keeps the S3 bucket private while CloudFront provides the public HTTPS endpoint.

AWS Amplify Hosting is also not used for this project. Amplify would be a convenient managed hosting option, but this project intentionally uses S3 and CloudFront directly in order to demonstrate the underlying cloud operations work: private bucket access, CloudFront delivery, bucket policy configuration, cache invalidation, IAM guardrails, and future deployment automation.


## IAM and Permissions Model

This project no longer uses the AWS root account for normal console work.

Current access model:

* Root account:

  * Used only for account-level or emergency tasks.
  * MFA is enabled.
  * Not used for normal project work.

* IAM admin user:

  * Used for normal AWS console administration.
  * Added to an admin group with broad permissions for learning and project build work.
  * MFA should be enabled for normal use.

* Future deployment automation:

  * Planned to use role-based access and temporary permissions where possible.
  * Intended for the Python deployment tool and later GitHub Actions workflow.
  * Deployment permissions should be scoped to the required actions only, such as uploading website files to S3 and creating CloudFront invalidations.

## Deployment Authentication Model

The project uses a deliberately separated deployment authentication model.

For local deployment testing, the deploy chain is:

```text
Local AWS profile
→ IAM user credentials
→ AssumeRole
→ temporary deploy role credentials
→ S3 upload
→ CloudFront invalidation
```

This is more complex than giving one IAM user direct deployment permissions, but it is intentional. The goal is to separate **authentication source** from **deployment permission set**, so the deploy role can later be reused by GitHub Actions.

### Components

| Component               | Type                  | Purpose                                                                              |
| ----------------------- | --------------------- | ------------------------------------------------------------------------------------ |
| `portfolio-role-runner` | AWS IAM user          | Local bootstrap identity with a long-lived access key                                |
| `portfolio-runner`      | Local AWS CLI profile | Local Ubuntu profile that stores/uses the IAM user credentials                       |
| `PortfolioDeployRole`   | AWS IAM role          | Temporary deployment identity with S3 upload and CloudFront invalidation permissions |
| `portfolio-deploy`      | Local AWS CLI profile | Local Ubuntu profile that uses `portfolio-runner` to assume `PortfolioDeployRole`    |

The similarly named components are different things:

```text
portfolio-role-runner = AWS IAM user
portfolio-runner      = local AWS profile using that user's access key
PortfolioDeployRole   = AWS IAM role with deployment permissions
portfolio-deploy      = local AWS profile that assumes the deploy role
```

### Why the IAM user does not deploy directly

A simpler local-only design would be:

```text
IAM user access key
→ S3 upload
→ CloudFront invalidation
```

That would work, and for a small local-only project it would be simpler.

This project instead uses:

```text
IAM user access key
→ assume deploy role
→ temporary role credentials
→ S3 upload
→ CloudFront invalidation
```

The IAM user `portfolio-role-runner` is not intended to own the deployment permissions directly. Its purpose is only to authenticate locally and request temporary credentials for `PortfolioDeployRole`.

The actual deployment permissions live on `PortfolioDeployRole`.

This means the deployment permission set is attached to a role, not permanently tied to one local IAM user. Later, GitHub Actions can assume the same role using OIDC, replacing the local IAM user access key as the deployment source.

### Local profile flow

The local profile `portfolio-runner` contains the starting credentials.

The local profile `portfolio-deploy` contains the role-assumption recipe:

```text
source_profile = portfolio-runner
role_arn       = PortfolioDeployRole
```

When Python/boto3 uses the `portfolio-deploy` profile, boto3 performs the following chain:

```text
Python deploy script starts
        ↓
boto3 uses local profile: portfolio-deploy
        ↓
portfolio-deploy points to source_profile: portfolio-runner
        ↓
boto3 loads portfolio-runner credentials
        ↓
AWS authenticates the IAM user: portfolio-role-runner
        ↓
AWS checks whether the user may call sts:AssumeRole
        ↓
AWS checks whether PortfolioDeployRole trusts that user
        ↓
AWS returns temporary credentials for PortfolioDeployRole
        ↓
boto3 uses the temporary role credentials
        ↓
Python uploads files to S3
        ↓
Python creates a CloudFront invalidation
```

The important point is:

```text
The role does not authenticate directly.
The IAM user authenticates first.
AWS then issues temporary credentials for the role.
```

### Required permissions

The IAM user `portfolio-role-runner` only needs permission to call:

```text
sts:AssumeRole
```

on:

```text
PortfolioDeployRole
```

The role `PortfolioDeployRole` contains the actual deployment permissions:

```text
s3:PutObject
cloudfront:CreateInvalidation
```

These are scoped to the portfolio S3 bucket and CloudFront distribution.

The deploy identity does not require:

```text
s3:DeleteObject
s3:DeleteBucket
s3:PutBucketPolicy
s3:DeleteBucketPolicy
s3:PutLifecycleConfiguration
```

### Tradeoff

For local-only deployment, this design is more complicated than necessary.

A direct IAM user with narrowly scoped `s3:PutObject` and `cloudfront:CreateInvalidation` permissions would also be valid.

This project uses the role-based design anyway because it better matches the intended final architecture:

```text
today:
Local IAM user key
→ assume PortfolioDeployRole
→ run Python deployment

future:
GitHub Actions OIDC
→ assume PortfolioDeployRole
→ run Python deployment
```

The local IAM user is therefore temporary scaffolding for learning and local testing. The long-term goal is not to depend on a permanent local IAM user access key for deployment.

### Desired final deployment flow

The intended final workflow is:

```text
git push
→ GitHub Actions starts
→ GitHub assumes PortfolioDeployRole
→ Python deployment script runs
→ files are uploaded to S3
→ CloudFront invalidation is created
```

At that point, routine deployment should require only:

```bash
git add .
git commit -m "Update portfolio"
git push
```

No manual AWS Console login should be required for normal deployment.


## S3 Protection Guardrail

S3 Bucket Versioning is intentionally not enabled for this small static deployment bucket.

Reasoning:

* Git/GitHub is treated as the source of truth for website files.
* S3 is treated as the deployment target, not the primary version history.
* Normal deployment requires the ability to overwrite existing files.
* Enabling S3 Versioning would add lifecycle and storage-management complexity that is not currently needed for this project.

Instead, the bucket policy includes an explicit deny guardrail for the IAM admin user to reduce accidental damage.

The IAM admin user can still update deployed files, but is denied actions such as:

* deleting deployed objects
* deleting the bucket
* deleting or modifying the bucket policy
* configuring lifecycle behavior that could remove objects

This was tested by attempting to delete `script.js` and attempting to delete the bucket policy from the IAM admin user session. Both actions were denied.

## Current Build Status

Completed:

* Ubuntu VM setup
* Git/GitHub workflow
* Local portfolio page
* Static AWS hosting with private S3 and CloudFront
* Verified certification badge links
* Root MFA setup
* IAM admin user setup
* S3 bucket deletion guardrail
* Local Python deployment script
* Automated S3 upload and CloudFront invalidation
* GitHub Actions CI/CD deployment workflow

Planned:

* Serverless backend
* API Gateway + Lambda
* DynamoDB visitor counter or project metadata
* CloudWatch logging and troubleshooting

## Deployment Workflow

Routine deployment is now automated through GitHub Actions.

Current deployment flow:

```text
git push to main
→ GitHub Actions workflow starts
→ GitHub Actions assumes PortfolioDeployRole through OIDC
→ Python deployment script runs
→ website files are uploaded to S3
→ CloudFront invalidation is created
→ live CloudFront site is updated
```

The workflow file is located at:

```text
.github/workflows/deploy.yml
```

The Python deployment script is located at:

```text
tools/deploy.py
```

For normal deployment, no manual AWS Console upload is required.

Routine deployment command flow:

```bash
git add .
git commit -m "Update portfolio"
git push
```

After the push, GitHub Actions runs the deployment workflow automatically.

## Local Python Deployment Test

Before moving deployment into GitHub Actions, the Python deployment script was tested locally.

The script performs two deployment actions:

```text
1. Upload website files from website/ to the private S3 bucket
2. Create a CloudFront invalidation for /*
```

The script uses `boto3` and does not contain AWS access keys or secret credentials.

For the local test, AWS credentials were provided through the local AWS profile:

```text
portfolio-deploy
```

This profile used the local `portfolio-runner` source profile to assume the AWS role:

```text
PortfolioDeployRole
```

The script was run locally with:

```bash
AWS_PROFILE=portfolio-deploy python tools/deploy.py
```

The deployment completed successfully.

Observed output:

```text
Files found in website folder:
Uploaded: style.css (text/css)
Uploaded: script.js (application/javascript)
Uploaded: index.html (text/html)
Cache invalidated: IAY301RL9CHESDUIISB7RBYPYM
```

This confirmed that the local deployment chain worked before moving the workflow into GitHub Actions.

## GitHub Actions CI/CD Deployment

GitHub Actions is now used for automated deployment.

The workflow runs when changes are pushed to the `main` branch. It checks out the repository, sets up Python, installs `boto3`, configures temporary AWS credentials, and runs the Python deployment script.

The GitHub Actions workflow uses OpenID Connect (OIDC) to assume:

```text
PortfolioDeployRole
```

No long-lived AWS access key is stored in GitHub.

The GitHub Actions deployment chain is:

```text
GitHub Actions job
→ OIDC identity token
→ AWS STS
→ temporary PortfolioDeployRole credentials
→ boto3
→ S3 upload
→ CloudFront invalidation
```

This replaces the earlier manual deployment workflow and the local-only deployment step.

## Automation Progression

The deployment workflow evolved in stages:

1. Manual deployment
   Files were uploaded to S3 manually, and CloudFront invalidation was created manually.

2. Local Python automation
   A Python deployment script uploaded the site files to S3 and created the CloudFront invalidation from the local machine.

3. GitHub Actions CI/CD
   The same deployment logic now runs automatically from GitHub Actions after changes are pushed to the `main` branch.

This progression was intentional: first understand the manual process, then automate it locally, then move the workflow into a CI/CD pattern.


## Repository Structure

```text
website/
├── index.html
├── style.css
└── script.js
```

Planned structure:

```text
website/
├── index.html
├── style.css
└── script.js

tools/
└── deploy.py

docs/
└── IAM_AND_PERMISSIONS.md
```

## Skills Demonstrated

* Linux terminal workflow
* Git and GitHub version control
* Static website development
* AWS S3 private object storage
* AWS CloudFront HTTPS delivery
* Hosting architecture decision-making: private S3 origin with CloudFront instead of S3 static website hosting or Amplify
* IAM user, group, and policy setup
* Root account protection and MFA
* S3 bucket policy guardrails
* Manual deployment and cache invalidation
* Operational documentation
* Bilingual English/Japanese site content
* Documentation of real project progress
* Python Deployment with Boto3
* Github Actions CI/CD workflow
* OIDC-Based AWS role assumption from Github Actions
* Automated S3 upload and CloudFront invalidation

## Certifications

* AWS Solutions Architect – Associate
  https://www.credly.com/badges/d90a629b-7b16-4c0e-8c84-903acc4397c4/public_url

* AWS Cloud Practitioner
  https://www.credly.com/badges/c3ca8016-c9d7-4f4a-8cd0-62cb293e47a1/public_url

* CompTIA A+
  https://www.credly.com/badges/7d23a7b4-8425-4e25-9cda-e0ec5e36d6e5/public_url

* JLPT N2

## Purpose

This repository is part of a practical cloud operations learning sprint. The project is designed to show not only completed work, but also the process of building, deploying, documenting, troubleshooting, securing, and improving a cloud-hosted system.

