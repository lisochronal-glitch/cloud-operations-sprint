# Cloud Operations Portfolio

[日本語版](readme.md)

A practical AWS / cloud operations sprint: a set of working, deployed systems built to demonstrate cloud deployment, Linux workflow, Git/GitHub, IAM design, CI/CD, event-driven architecture, infrastructure as code, and operational troubleshooting.

**Live site:** https://d1rzzxjs182iar.cloudfront.net

## Projects

| Project | What it demonstrates | Status |
|---|---|---|
| **[This portfolio site](#project-overview)** — private S3 + CloudFront, GitHub Actions OIDC deploy, serverless visitor counter | S3, CloudFront, IAM roles, OIDC, Python/boto3 automation, API Gateway, Lambda, DynamoDB, CORS, CloudWatch | Live |
| **[Secure VPC Foundation](projects/secure-vpc-foundation/)** — multi-AZ network with public ALB, private EC2/RDS tiers | VPC, subnets, route tables, security groups, ALB, Auto Scaling, RDS, NAT Gateway, S3 Gateway Endpoint, CloudFormation, Terraform | Built, verified, decommissioned |
| **[Asynchronous SaaS Order Processing](projects/event-driven-order-processing-workflow/)** — event-driven order workflow with a live public demo | API Gateway, Lambda, SNS, SQS, DynamoDB, SES, dead-letter queue, CloudWatch alarms, automated containment, CloudTrail | Live |

Each project is documented as a complete working system, including the decisions that were rejected and why.

The rest of this document covers the portfolio site itself. Each project above has its own README with architecture, evidence, and cleanup notes.

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

## Serverless Visitor Counter Backend

This portfolio site now includes a small serverless backend feature: a visible visitor counter displayed in the site footer.

When the site loads, browser JavaScript sends a `POST` request to an API Gateway HTTP API route:

```text
POST /visit
```

API Gateway invokes a Python Lambda function. The Lambda function extracts the visitor source IP from the API Gateway request metadata, combines it with a salt stored as a Lambda environment variable, hashes it with SHA-256, and stores only the resulting hash in DynamoDB.

The raw IP address is not stored.

The DynamoDB table stores two types of records:

```text
visitor_hash = hashed visitor identifier
visitor_hash = "__stats__"
```

Normal visitor records track:

```text
first_seen
last_seen
visit_count
```

The `__stats__` record tracks global site totals:

```text
total_visits
unique_visitors
last_updated
```

The Lambda function updates both the per-visitor record and the global stats record, then returns the latest totals to the frontend. JavaScript receives the response and updates the footer visitor counter on the live site.

Current backend flow:

```text
Browser loads CloudFront site
→ script.js sends POST request to API Gateway /visit
→ API Gateway invokes VisitorCounterFunction
→ Lambda hashes visitor identifier
→ Lambda updates DynamoDB visitor record
→ Lambda updates DynamoDB __stats__ record
→ Lambda returns total_visits and unique_visitors
→ JavaScript displays the counter in the footer
```

This feature demonstrates:

* API Gateway HTTP API routing
* Lambda integration
* Python Lambda backend logic
* DynamoDB state management
* conditional writes for new visitor detection
* atomic counter updates
* Lambda environment variables
* IAM least-privilege access from Lambda to DynamoDB
* CORS configuration for browser-to-API communication
* frontend/backend integration using JavaScript `fetch`
* CloudWatch logging and troubleshooting during development

The footer counter is intentionally visible on the site. It acts as a small proof surface for the underlying backend stack: the displayed number is not hardcoded, but returned from DynamoDB through the API Gateway and Lambda path.


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

* Deployment automation:

  * Uses role-based access and temporary permissions where possible.
  * Python deployment tool and GitHub Actions workflow.
  * Deployment permissions are scoped to the required actions only, such as uploading website files to S3 and creating CloudFront invalidations.

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

This is more complex than giving one IAM user direct deployment permissions, but it is intentional. The goal is to separate **authentication source** from **deployment permission set**, so the deploy role could be reused by GitHub Actions.

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

This means the deployment permission set is attached to a role, not permanently tied to one local IAM user. GitHub Actions now assumes the same role using OIDC, replacing the local IAM user access key as the deployment source.

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

CI/CD:
GitHub Actions OIDC
→ assume PortfolioDeployRole
→ run Python deployment
```

The local IAM user was temporary scaffolding for learning and local testing. Routine deployment has now moved to GitHub Actions, so normal deployment no longer depends on a permanent local IAM user access key.

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


## Cost and Operational Guardrails

This project aims to keep costs small and predictable. Its public entry points
use throttling and containment to reduce the cost impact of traffic spikes;
these controls do not guarantee a fixed bill.

### Account level

* AWS Budgets is configured as an account-level cost alarm.
* The Secure VPC Foundation lab was fully decommissioned after verification
  rather than left running, because NAT Gateway and RDS are the two most
  expensive resources in this portfolio. Cleanup is documented and evidenced in
  that project.
* The SES notification branch was implemented, verified, and then disconnected
  from public demo traffic, so visitor clicks do not send email.

### Public endpoint protection

Two endpoints are public and unauthenticated: the visitor counter
(`POST /visit`) and the order workflow demo (`POST /orders`). Both use the same
two-layer approach — a rate limit that reduces traffic reaching the backend,
and an alarm-driven kill switch that contains elevated invocations.

| Endpoint | Rate limit | Burst | Reasoning |
|---|---|---|---|
| Visitor counter | 5 req/sec | 10 | Fires on every page load; updates a visitor record and aggregate counters in DynamoDB |
| Order workflow | 2 req/sec | 5 | Deliberate button click; each request writes DynamoDB, publishes SNS, fans out to SQS, and triggers a second Lambda |

Throttling was chosen as the first line of defence because it is free to
configure and reduces downstream work before an alarm needs to react. API
Gateway throttling is best effort, not a guaranteed request ceiling or spending
cap. See the [AWS throttling documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html).
AWS WAF was considered and rejected: richer rule matching, but a monthly charge
not justified for a portfolio demo.

Throttling limits the request rate but not how long a spike lasts, so both
functions are also monitored by CloudWatch alarms on invocation count. The
order workflow uses an SNS safety topic with an email subscriber and a
containment Lambda subscriber. The visitor-counter alarm sends an SNS
notification to `project3-demo-safety-alerts` and directly invokes
`visitor-counter-emergency-disable` as a separate alarm action. Each containment
Lambda sets reserved concurrency to 0 on its target, stopping invocations until
a human removes the setting.

Each public entry point has its own single-purpose containment Lambda, and each
execution role is scoped to `lambda:PutFunctionConcurrency` on exactly one
function ARN:

| Containment Lambda | Target |
|---|---|
| `project3-emergency-disable-demo` | `project3-order-publisher` |
| `visitor-counter-emergency-disable` | `VisitorCounterFunction` |

A single shared Lambda would need a role covering both targets, so a bug or an
unexpected event could disable the wrong endpoint. Separate roles mean neither
function is *able* to affect the other — the constraint sits in IAM rather than
in application logic, at the cost of a little duplicated code.

The visitor counter containment path was tested end to end, including recovery.
See [backend/visitor-counter/README.md](backend/visitor-counter/README.md) for
the test steps, evidence, and known limitations.

### Access for tooling

When an agent needed read access to Lambda in order to export console-authored
function source into this repository, a scoped IAM Identity Center permission
set (`CodexLambdaExport-889149079837`) was created rather than issuing a long-lived
IAM access key. The tooling received temporary credentials limited to that
permission set, and no permanent AWS credentials were shared.
The permission set was subsequently updated to include read access to
`visitor-counter-emergency-disable`, and its source is now exported into Git
alongside the other six Lambda functions.

### Static hosting

The site is served from CloudFront over a private S3 bucket. CloudFront caching
is enabled, so cache hits are served from the edge rather than generating S3
requests. Deployments create a single `/*` invalidation, and the deployment
workflow is filtered by path so documentation-only commits do not trigger an
upload and invalidation cycle.

### Scope note

The throttling, alarms, and containment Lambdas described above were configured
manually through the AWS Console and CLI. They are not defined in CloudFormation
or Terraform in this repository. The Secure VPC Foundation project is the
infrastructure-as-code work in this portfolio.

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
* Serverless backend
* API Gateway HTTP API
* Lambda visitor counter function
* DynamoDB visitor counter table
* Visible footer visitor counter
* Browser-to-API CORS configuration
* CloudWatch logging and troubleshooting verification

Planned:

* Custom domain with Route 53 and an ACM certificate
* Architecture diagram for the portfolio site itself
* Next project: containers and observability lab


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
.github/
└── workflows/
    └── deploy.yml          CI/CD: OIDC role assumption + Python deploy

backend/
└── visitor-counter/
    ├── README.md           Endpoint safety, containment test, limitations
    ├── evidence/           Containment test screenshots
    └── src/                Exported Lambda source (counter + kill switch)

projects/                   Per-project documentation and source
├── secure-vpc-foundation/
│   ├── readme.md
│   ├── evidence/
│   ├── notes/
│   ├── template/           CloudFormation
│   └── terraform/
└── event-driven-order-processing-workflow/
    ├── readme.md
    ├── readme-ja.md
    ├── evidence/
    ├── notes/
    └── src/                Exported Lambda source

tools/
├── deploy.py               boto3: S3 upload + CloudFront invalidation
└── export_lambdas.sh       Pull console-authored Lambdas into Git

website/                    Deployed to S3, served via CloudFront
├── index.html
├── style.css
├── script.js
└── projects/
    ├── secure-vpc-foundation/
    └── event-driven-order-processing-workflow/

readme.md                   English
readme-ja.md                Japanese
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
* Python deployment automation with `boto3`
* GitHub Actions CI/CD workflow
* OIDC-based AWS role assumption from GitHub Actions
* Automated S3 upload and CloudFront invalidation
* API Gateway HTTP API route configuration
* Python Lambda function development
* DynamoDB table design for visitor records and aggregate stats
* DynamoDB conditional writes and atomic counter updates
* Lambda environment variable configuration
* IAM least-privilege permissions for Lambda-to-DynamoDB access
* CORS configuration for frontend-to-backend browser requests
* Frontend/backend integration using JavaScript `fetch`
* CloudWatch-based Lambda/API troubleshooting
* Visible serverless backend feature connected to the live portfolio site



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
