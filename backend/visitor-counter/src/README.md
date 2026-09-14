# Visitor counter Lambda source

This function backs the visitor counter in the portfolio site footer. It was
authored directly in the AWS Lambda console and was previously not in version
control at all.

It is exported with:

    AWS_PROFILE=<admin-profile> ./tools/export_lambdas.sh

`function-config.json` records runtime, handler, memory, timeout, execution role
name, and the *names* of its environment variables. The salt used to hash
visitor IP addresses is a Lambda environment variable and its value is never
exported to this repository.

## Known limitation

This is a one-way export, not a deployment pipeline. Changes made in the console
are not reflected here until the export is re-run.
