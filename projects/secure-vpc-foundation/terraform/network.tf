resource "aws_vpc" "project" {
  cidr_block           = "10.20.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "project2-vpc"
  }
}

resource "aws_internet_gateway" "project" {
  tags = {
    Name = "project2-igw"
  }
}

resource "aws_internet_gateway_attachment" "project" {
  internet_gateway_id = aws_internet_gateway.project.id
  vpc_id              = aws_vpc.project.id
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.project.id
  cidr_block              = "10.20.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "project2-public-a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.project.id
  cidr_block              = "10.20.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true

  tags = {
    Name = "project2-public-b"
  }
}

resource "aws_subnet" "private_app_a" {
  vpc_id                  = aws_vpc.project.id
  cidr_block              = "10.20.11.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = {
    Name = "project2-private-app-a"
  }
}

resource "aws_subnet" "private_app_b" {
  vpc_id                  = aws_vpc.project.id
  cidr_block              = "10.20.12.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = {
    Name = "project2-private-app-b"
  }
}

resource "aws_subnet" "private_db_a" {
  vpc_id                  = aws_vpc.project.id
  cidr_block              = "10.20.21.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = {
    Name = "project2-private-db-a"
  }
}

resource "aws_subnet" "private_db_b" {
  vpc_id                  = aws_vpc.project.id
  cidr_block              = "10.20.22.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = {
    Name = "project2-private-db-b"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.project.id

  tags = {
    Name = "project2-public-rt"
  }
}

resource "aws_route" "public_default" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.project.id
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "project2-nat-eip"
  }
}

resource "aws_nat_gateway" "project" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id

  depends_on = [
    aws_internet_gateway_attachment.project
  ]

  tags = {
    Name = "project2-nat-gateway"
  }
}

resource "aws_route_table" "private_app" {
  vpc_id = aws_vpc.project.id

  tags = {
    Name = "project2-private-app-rt"
  }
}

resource "aws_route" "private_app_default" {
  route_table_id         = aws_route_table.private_app.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.project.id
}

resource "aws_route_table_association" "private_app_a" {
  subnet_id      = aws_subnet.private_app_a.id
  route_table_id = aws_route_table.private_app.id
}

resource "aws_route_table_association" "private_app_b" {
  subnet_id      = aws_subnet.private_app_b.id
  route_table_id = aws_route_table.private_app.id
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.project.id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"

  route_table_ids = [
    aws_route_table.private_app.id
  ]

  tags = {
    Name = "project2-s3-gateway-endpoint"
  }
}

resource "aws_route_table" "private_db" {
  vpc_id = aws_vpc.project.id

  tags = {
    Name = "project2-private-db-rt"
  }
}

resource "aws_route_table_association" "private_db_a" {
  subnet_id      = aws_subnet.private_db_a.id
  route_table_id = aws_route_table.private_db.id
}

resource "aws_route_table_association" "private_db_b" {
  subnet_id      = aws_subnet.private_db_b.id
  route_table_id = aws_route_table.private_db.id
}
