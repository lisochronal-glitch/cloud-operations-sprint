# Visitor counter Lambda source

Two functions are exported here:

* `VisitorCounterFunction` — backs the visitor counter in the portfolio site
  footer.
* `visitor-counter-emergency-disable` — containment. Invoked by the
  `visitor-counter-invocation-spike` CloudWatch alarm, it sets reserved
  concurrency on `VisitorCounterFunction` to 0.

Both were authored directly in the AWS Lambda console and were not in version
control when first written.

It is exported with:

    AWS_PROFILE=<admin-profile> ./tools/export_lambdas.sh

`function-config.json` records runtime, handler, memory, timeout, execution role
name, and the *names* of its environment variables. The salt used to hash
visitor IP addresses is a Lambda environment variable and its value is never
exported to this repository.

## Known limitation

This is a one-way export, not a deployment pipeline. Changes made in the console
are not reflected here until the export is re-run.
