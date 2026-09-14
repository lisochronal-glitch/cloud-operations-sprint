# Lambda source

These functions were authored directly in the AWS Lambda console during the
build, rather than being deployed from this repository. That made iteration
fast, but it meant the deployed function was the only copy of the code — the
one part of this project with no source of truth in Git.

They are exported back into version control with:

    AWS_PROFILE=<admin-profile> ./tools/export_lambdas.sh

Each function directory contains the deployed source plus a
`function-config.json` recording runtime, handler, memory, timeout, execution
role name, and the *names* of its environment variables. Environment variable
values are never exported.

## Known limitation

This is a one-way export, not a deployment pipeline. The console remains the
place where changes are made, and this repo holds the exported snapshot. A
change made in the console is not reflected here until the export is re-run.

Closing that loop — defining these functions in CloudFormation or Terraform, as
was done for the Secure VPC Foundation project, and deploying them from CI — is
the natural next step for this project.
