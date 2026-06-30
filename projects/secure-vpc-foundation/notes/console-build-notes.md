# Console Build Notes

This file records the first manual AWS Console build for the Secure VPC Foundation project.

## Purpose

The purpose of the console build was to validate the architecture before reproducing it with CloudFormation.

The lab was built manually, verified through the Application Load Balancer, documented with screenshots, and then fully decommissioned to avoid ongoing charges.

## Region

* Region: `ap-northeast-1`
* Location: Tokyo

## Resource Prefix

All temporary lab resources used the prefix:

```text
project2
```

## Main Architecture

The environment used:

* One VPC
* Two public subnets
* Two private application subnets
* Two private database subnets
* Internet Gateway
* NAT Gateway
* S3 Gateway Endpoint
* Application Load Balancer
* Auto Scaling Group
* Two private EC2 application instances
* RDS PostgreSQL database in private DB subnets

## Traffic Flow

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

## Important Design Choices

The Application Load Balancer was placed in public subnets.

The EC2 application instances were placed in private application subnets and received traffic only from the ALB security group.

The RDS database was placed in private database subnets with public access disabled.

The private application route table used a NAT Gateway for outbound internet access.

The private database route table had only the local VPC route and no internet route.

An S3 Gateway Endpoint was added to represent private S3 access from the application tier.

## Auto Scaling Group Note

The Auto Scaling Group used a launch-before-terminate instance maintenance policy.

This was selected deliberately to prioritize availability during instance replacement.

No automatic scaling policy was configured in this console build. A future version could add target tracking, scheduled scaling, or predictive scaling if application traffic growth required it.

## Verification Result

The Application Load Balancer DNS name successfully served the test web page.

The page confirmed that traffic was reaching a private EC2 instance behind the public ALB.

The target group showed healthy targets.

## Cleanup Result

All temporary project resources were deleted after verification.

Cleanup checks confirmed:

* No running project2 EC2 instances
* Auto Scaling Group deleted
* Launch template deleted
* Target group deleted
* Application Load Balancer deleted
* RDS database deleted
* RDS snapshot found and deleted
* NAT Gateway deleted
* No Elastic IP remained
* S3 Gateway Endpoint deleted
* Project VPC deleted
* Project subnets deleted
* Project route tables deleted
* Project security groups deleted

Remaining default VPC resources in the Tokyo region were not part of the project and were left in place.
