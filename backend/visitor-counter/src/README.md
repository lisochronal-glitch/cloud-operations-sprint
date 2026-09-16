# Visitor counter Lambda source

Two functions are exported here:

* `VisitorCounterFunction` — backs the visitor counter in the portfolio site
  footer.
* `visitor-counter-emergency-disable` — containment. Invoked by the
  `visitor-counter-invocation-spike` CloudWatch alarm, it sets reserved
  concurrency on `VisitorCounterFunction` to 0.

Both were authored directly in the AWS Lambda console and were not in version
control when first written.

Both are exported with:

    AWS_PROFILE=<admin-or-CodexLambdaExport-profile> ./tools/export_lambdas.sh

`function-config.json` records runtime, handler, memory, timeout, execution role
name, and the *names* of its environment variables. The salt used to hash
visitor IP addresses is a Lambda environment variable and its value is never
exported to this repository.

`visitor-counter-emergency-disable` uses a hardcoded `VisitorCounterFunction`
target and has no environment variables; its `EnvironmentVariableNames` list is
empty. The scoped Identity Center permission set was updated to include read
access to this function for the export.

See the [containment test and its two evidence screenshots](../README.md#containment-test)
for the alarm action, disabled counter, and recovery verification. The
[known limitations](../README.md#known-limitations) include the deferred
resource-policy restriction.

## Known limitation

This is a one-way export, not a deployment pipeline. Changes made in the console
are not reflected here until the export is re-run.
