data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

resource "aws_launch_template" "app" {
  name          = "project2-app-lt"
  image_id      = data.aws_ssm_parameter.al2023_ami.value
  instance_type = var.instance_type

  vpc_security_group_ids = [
    aws_security_group.app.id
  ]

  metadata_options {
    http_tokens   = "required"
    http_endpoint = "enabled"
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    set -eux

    dnf install -y httpd

    cat > /var/www/html/index.html <<'HTML'
    <!DOCTYPE html>
    <html>
    <body>
      <h1>Project 2 Secure VPC Foundation</h1>
      <p>This response is served by a private EC2 instance behind a public Application Load Balancer.</p>
      <p>Instance ID: PLACEHOLDER_INSTANCE_ID</p>
      <p>Availability Zone: PLACEHOLDER_AZ</p>
    </body>
    </html>
    HTML

    TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
    INSTANCE_ID=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)
    AZ=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/availability-zone)

    sed -i "s/PLACEHOLDER_INSTANCE_ID/$INSTANCE_ID/" /var/www/html/index.html
    sed -i "s/PLACEHOLDER_AZ/$AZ/" /var/www/html/index.html

    systemctl enable httpd
    systemctl start httpd
  EOF
  )

  tags = {
    Name = "project2-app-lt"
  }
}

resource "aws_autoscaling_group" "app" {
  name                      = "project2-app-asg"
  min_size                  = 2
  max_size                  = 2
  desired_capacity          = 2
  health_check_type         = "ELB"
  health_check_grace_period = 300

  vpc_zone_identifier = [
    aws_subnet.private_app_a.id,
    aws_subnet.private_app_b.id
  ]

  target_group_arns = [
    aws_lb_target_group.app.arn
  ]

  instance_maintenance_policy {
    min_healthy_percentage = 100
    max_healthy_percentage = 200
  }

  launch_template {
    id      = aws_launch_template.app.id
    version = aws_launch_template.app.latest_version
  }

  tag {
    key                 = "Name"
    value               = "project2-private-app-instance"
    propagate_at_launch = true
  }

  depends_on = [
    aws_route.private_app_default,
    aws_vpc_endpoint.s3,
    aws_lb_listener.http
  ]
}
