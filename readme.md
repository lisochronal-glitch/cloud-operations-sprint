# Cloud Operations Portfolio

A practical AWS / cloud operations portfolio project built to demonstrate cloud deployment, Linux workflow, Git/GitHub usage, documentation, and operational troubleshooting.

Live site:

https://d1rzzxjs182iar.cloudfront.net

## Project Overview

This project is a bilingual portfolio site deployed on AWS. The goal is to build a small but real cloud-hosted system while documenting the workflow clearly through Git history, project notes, and visible deployment progress.

The site is built with vanilla HTML, CSS, and JavaScript. It includes English/Japanese language switching, certification verification links, and a build status section showing current project progress.

## Current Architecture

* Static site files are stored in a private Amazon S3 bucket.
* CloudFront provides the public HTTPS endpoint.
* The S3 bucket is not publicly exposed.
* CloudFront caching remains enabled for normal operation.
* When files are updated in S3, a one-time CloudFront invalidation is created to refresh the deployed site.

## Current Build Status

Completed:

* Ubuntu VM setup
* Git/GitHub workflow
* Local portfolio page
* Static AWS hosting with S3 and CloudFront
* Verified certification badge links

Planned:

* Serverless backend
* API Gateway + Lambda
* DynamoDB visitor counter or project metadata
* CloudWatch logging and troubleshooting
* GitHub Actions deployment workflow

## Manual Deployment Workflow

Current deployment is manual:

1. Edit website files locally.
2. Test changes locally.
3. Commit and push changes to GitHub.
4. Upload updated files to S3.
5. Create a one-time CloudFront invalidation using `/*`.
6. Verify the live CloudFront site.

CloudFront invalidation is not a permanent setting. It is a one-time cache-clearing job used after a new version is uploaded. Caching remains enabled during normal operation.

## Repository Structure

```text
website/
├── index.html
├── style.css
└── script.js
```

## Skills Demonstrated

* Linux terminal workflow
* Git and GitHub version control
* Static website development
* AWS S3 private object storage
* AWS CloudFront HTTPS delivery
* Manual deployment and cache invalidation
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

This repository is part of a practical cloud operations learning sprint. The project is designed to show not only completed work, but also the process of building, deploying, documenting, troubleshooting, and improving a cloud-hosted system.
