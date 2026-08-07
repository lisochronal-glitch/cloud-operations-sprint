resource "aws_lb" "public" {
  name               = "project2-alb-public"
  internal           = false
  load_balancer_type = "application"
  ip_address_type    = "ipv4"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  tags = {
    Name = "project2-alb-public"
  }
}

resource "aws_lb_target_group" "app" {
  name        = "project2-app-tg"
  port        = 80
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = aws_vpc.project.id

  health_check {
    enabled  = true
    protocol = "HTTP"
    port     = "traffic-port"
    path     = "/"
    matcher  = "200"
  }

  tags = {
    Name = "project2-app-tg"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.public.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
