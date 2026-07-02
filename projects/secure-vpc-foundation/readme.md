# Secure VPC Foundation

This project demonstrates a secure AWS network foundation for a small web application. The application is reachable from the internet through a public Application Load Balancer, while the application servers and database are isolated in private subnets.

The environment was first built manually in the AWS Console to validate the architecture, capture evidence, and confirm the cleanup process. The same architecture was then reproduced with CloudFormation so the environment could be deployed, verified, and deleted repeatably as infrastructure as code.

## Scenario

A small company wants to migrate a simple web application to AWS.

The requirements are:

* Customers must be able to access the web application from the internet.
* Application servers must not be directly reachable from the public internet.
* The database must be isolated from direct public access.
* The application layer should support availability across two Availability Zones.
* The infrastructure should be reproducible.
* Billable resources must be removed after testing.

## Architecture

The lab was built in the Tokyo region (`ap-northeast-1`).

Network design:

* VPC: `10.20.0.0/16`
* Public subnets for the Application Load Balancer
* Private application subnets for EC2 instances in an Auto Scaling Group
* Private database subnets for Amazon RDS
* Internet Gateway for public ALB access
* NAT Gateway for outbound internet access from the private application tier
* S3 Gateway Endpoint for private S3 access
* Security groups controlling traffic between tiers

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
* Subnets
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
* CloudFormation

## Security Design

The public entry point is the Application Load Balancer. The EC2 application instances were placed in private subnets and did not use public IPv4 addresses.

Security group rules were designed so that:

* The ALB accepts HTTP traffic from the internet.
* The application tier accepts HTTP traffic only from the ALB security group.
* The database tier accepts PostgreSQL traffic only from the application security group.

The RDS database was configured with public access disabled and assigned to a private DB subnet group.

## Availability Design

The architecture used two Availability Zones.

The application tier was deployed through an Auto Scaling Group with two EC2 instances across private application subnets. The Auto Scaling Group used a launch-before-terminate maintenance policy to prioritize availability during instance replacement.

No automatic scaling policy was configured during the console validation build. A future version could add target tracking, scheduled scaling, or predictive scaling depending on application traffic requirements.

## Manual Console Build

The first phase of the project was built manually in the AWS Console.

This phase was used to:

* Validate the VPC, subnet, route table, and security group design
* Confirm that the ALB could route traffic to private EC2 instances
* Confirm that the EC2 instances did not require public IPv4 addresses
* Configure a private RDS database tier
* Capture evidence screenshots
* Practice safe cleanup of billable AWS resources

The manual build confirmed that the architecture worked before reproducing it as infrastructure as code.

## CloudFormation Reproduction

The second phase reproduced the same architecture with CloudFormation.

Template:

* [`secure-vpc-foundation-template.yaml`](./secure-vpc-foundation-template.yaml)

The CloudFormation deployment created the VPC, six subnets, route tables, Internet Gateway, NAT Gateway, S3 Gateway Endpoint, security groups, Application Load Balancer, target group, launch template, Auto Scaling Group, EC2 instances, DB subnet group, and private RDS PostgreSQL instance.

The stack was deployed successfully and verified with the same operational checks as the manual console build:

* The ALB URL returned the test web page.
* The target group showed two healthy targets.
* The EC2 instances had private IP addresses and no public IPv4 addresses.
* The RDS instance had public access disabled.
* The CloudFormation stack was deleted after testing.
* Post-deletion checks confirmed that billable project resources were removed.

## Verification

The application was successfully accessed through the public Application Load Balancer DNS name.

The browser test confirmed that traffic reached a private EC2 instance behind the public ALB. The target group also showed two healthy targets, confirming that the ALB could route traffic to the private application tier.

Key evidence screenshots are stored in the [`evidence/`](./evidence/) folder.

Selected evidence:

* [VPC resource map](./evidence/project2-vpc-resource-map.png)
* [Subnet layout across two Availability Zones](./evidence/project2-subnets.png)
* [Public route table with Internet Gateway route](./evidence/project2-public-route-table-igw.png)
* [Public route table associations with public subnets](./evidence/project2-public-route-table-associations.png)
* [Private application route table with NAT Gateway and S3 Gateway Endpoint routes](./evidence/project2-private-app-route-table-nat-s3-endpoint.png)
* [Application Load Balancer details and HTTP listener](./evidence/project2-alb-public-details.png)
* [ALB security group allowing HTTP from the internet](./evidence/project2-alb-sg-public-http.png)
* [Application security group allowing HTTP from the ALB security group](./evidence/project2-app-sg-source-alb-sg.png)
* [Private EC2 instance with no public IPv4 address](./evidence/project2-private-ec2-instances2.png)
* [RDS configuration with public access disabled](./evidence/project2-rds-private-no-public-access.png)
* [Healthy target group with two registered targets](./evidence/project2-target-group-healthy.png)
* [Auto Scaling Group with desired capacity of two instances](./evidence/project2-auto-scaling-group.png)
* [Launch-before-terminate maintenance policy](./evidence/project2-asg-launch-before-terminating.png)
* [Successful browser test through the ALB](./evidence/project2-alb-browser-success.png)

## Cleanup

All billable resources were deleted after verification.

Deleted resources included:

* Auto Scaling Group and EC2 instances
* Application Load Balancer
* Target group
* RDS database
* RDS snapshot from the manual build
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

The CloudFormation stack was also deleted successfully after the infrastructure-as-code validation. Additional checks confirmed that the NAT Gateway was deleted, no project Elastic IP remained allocated, the RDS instance was removed, and the EC2 instances were terminated.

## Outcome

This project demonstrates the ability to design, validate, document, reproduce, and clean up a secure AWS network foundation.

The completed project includes both:

* A manual AWS Console build with evidence screenshots
* A CloudFormation template for repeatable infrastructure deployment

The architecture provides a practical foundation for a small web application where the public entry point is limited to an Application Load Balancer, while the application and database tiers remain private.
