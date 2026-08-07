output "alb_dns_name" {
  description = "Public DNS name for the Application Load Balancer."
  value       = aws_lb.public.dns_name
}

output "alb_url" {
  description = "Browser URL for testing the public ALB path."
  value       = "http://${aws_lb.public.dns_name}"
}

output "vpc_id" {
  description = "Created VPC ID."
  value       = aws_vpc.project.id
}

output "private_rds_endpoint" {
  description = "Private RDS endpoint address."
  value       = aws_db_instance.postgres.address
}

output "s3_gateway_endpoint_id" {
  description = "S3 Gateway Endpoint ID."
  value       = aws_vpc_endpoint.s3.id
}
