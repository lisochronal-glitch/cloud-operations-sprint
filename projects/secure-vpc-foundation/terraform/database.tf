resource "aws_db_subnet_group" "project" {
  name        = "project2-db-subnet-group"
  description = "Private DB subnet group for Project 2."

  subnet_ids = [
    aws_subnet.private_db_a.id,
    aws_subnet.private_db_b.id
  ]

  tags = {
    Name = "project2-db-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "project2-private-postgres"

  engine            = "postgres"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  storage_type      = "gp2"

  username            = "projectadmin"
  password_wo         = var.db_password
  password_wo_version = 1

  db_subnet_group_name   = aws_db_subnet_group.project.name
  vpc_security_group_ids = [aws_security_group.db.id]

  publicly_accessible      = false
  multi_az                 = false
  deletion_protection      = false
  backup_retention_period  = 0
  delete_automated_backups = true

  skip_final_snapshot = true

  tags = {
    Name = "project2-private-postgres"
  }
}
