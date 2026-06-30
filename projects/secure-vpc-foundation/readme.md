# Secure VPC Foundation

This project demonstrates a secure AWS network foundation for a small web application. The application is reachable from the internet through a public Application Load Balancer, while the application servers and database are placed in private subnets.

The lab was first built manually in the AWS Console to validate the architecture, capture evidence, and confirm the cleanup process. The same architecture is intended to be reproduced with CloudFormation as an infrastructure-as-code version.

## Scenario

A small company wants to migrate a simple web application to AWS.

The requirements are:

* Customers must be able to access the web application from the internet.
* Application servers should not be directly reachable from the public internet.
* The database should be isolated in private database subnets.
* The infrastructure should support high availability across two Availability Zones.
* Billable resources should be removed after testing.

## Architecture

The environment was built in the Tokyo region (`ap-northeast-1`).

Network design:

* VPC: `10.20.0.0/16`
* Public subnets for the Application Load Balancer
* Private application subnets for EC2 instances in an Auto Scaling Group
* Private database subnets for RDS
* Internet Gateway for public ALB access
* NAT Gateway for outbound internet access from the private application tier
* S3 Gateway Endpoint for private S3 access
* Security groups restricting traffic between tiers

Traffic flow:

```text
Internet
  ↓
Internet Gateway
  ↓
Public Application Load Balancer
  ↓
Private EC2 application instances
  ↓
Private RDS database
```

## AWS Services Used

* Amazon VPC
* Public and private subnets
* Route tables
* Internet Gateway
* NAT Gateway
* Security Groups
* Application Load Balancer
* EC2
* Auto Scaling Group
* Launch Template
* Amazon RDS for PostgreSQL
* DB subnet group
* S3 Gateway Endpoint

## Security Design

The public entry point is the Application Load Balancer. The EC2 application instances were placed in private subnets and did not require public IP addresses.

Security group rules were configured so that:

* The ALB accepts HTTP traffic from the internet.
* The application tier accepts HTTP traffic only from the ALB security group.
* The database tier accepts PostgreSQL traffic only from the application security group.

The database was created with public access disabled and placed in a private DB subnet group.

## Availability Design

The architecture used two Availability Zones.

The application tier was deployed through an Auto Scaling Group with two EC2 instances across private application subnets. The Auto Scaling Group used a launch-before-terminate maintenance policy to prioritize availability during instance replacement.

No automatic scaling policy was configured in the console lab. A future version could add target tracking, scheduled scaling, or predictive scaling depending on application requirements.

## Verification

The application was successfully accessed through the public ALB DNS name.

The test page confirmed that traffic reached a private EC2 instance behind the Application Load Balancer.

Evidence captured includes:

* VPC resource map
* Public route table with Internet Gateway route
* Private application route table with NAT Gateway route
* Private database route table with local-only routing
* Security group rules between ALB, app, and database tiers
* RDS database with public access disabled
* Healthy target group
* Auto Scaling Group configuration
* Browser test through the ALB DNS name

## Cleanup

All billable resources were deleted after verification.

Deleted resources included:

* Auto Scaling Group and EC2 instances
* Application Load Balancer
* Target group
* RDS database
* RDS snapshot
* NAT Gateway
* S3 Gateway Endpoint
* Launch template
* DB subnet group
* Security groups
* Route tables
* Subnets
* Internet Gateway
* VPC

Post-cleanup checks confirmed that no `project2` resources remained in EC2, RDS, VPC, NAT Gateway, Elastic IP, Load Balancer, Target Group, or Auto Scaling Group views.

## Next Step

The next phase is to reproduce this architecture with CloudFormation so the environment can be deployed and deleted repeatably as infrastructure as code.
