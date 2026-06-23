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
* Static AWS hosting with S3 and CloudFront
* Verified certification badge links
* Root MFA setup
* IAM admin user setup
* S3 bucket deletion guardrail

Planned:

* Python deployment CLI
* Automated S3 upload and CloudFront invalidation
* GitHub Actions deployment workflow
* Serverless backend
* API Gateway + Lambda
* DynamoDB visitor counter or project metadata
* CloudWatch logging and troubleshooting

## Manual Deployment Workflow

Current deployment is manual:

1. Edit website files locally.
2. Test changes locally.
3. Commit and push changes to GitHub.
4. Upload updated files to S3.
5. Create a one-time CloudFront invalidation using `/*`.
6. Verify the live CloudFront site.

CloudFront invalidation is not a permanent setting. It is a one-time cache-clearing job used after a new version is uploaded. Caching remains enabled during normal operation.

The next improvement is a Python deployment CLI that automates the S3 upload and CloudFront invalidation steps.

## Planned Automation Progression

The deployment workflow is intended to evolve in stages:

1. Manual deployment
   Files are uploaded to S3 manually, and CloudFront invalidation is created manually.

2. Local Python automation
   A Python CLI will upload the site files to S3 and create the CloudFront invalidation.

3. GitHub Actions CI/CD
   The deployment workflow will later run from GitHub Actions after changes are pushed to the main branch.

This progression is intentional: first understand the manual process, then automate it locally, then move the same workflow into a more professional CI/CD pattern.

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

