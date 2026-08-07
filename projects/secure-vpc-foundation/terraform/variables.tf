variable "aws_region" {
  description = "AWS region used for Project 2."
  type        = string
  default     = "ap-northeast-1"
}

variable "instance_type" {
  description = "EC2 instance type used by the application Auto Scaling Group."
  type        = string
  default     = "t3.micro"
}

variable "db_instance_class" {
  description = "RDS instance class used by the temporary PostgreSQL database."
  type        = string
  default     = "db.t3.micro"
}

variable "db_password" {
  description = "Master password for the temporary Project 2 PostgreSQL database."
  type        = string
  sensitive   = true
  ephemeral   = true
}
