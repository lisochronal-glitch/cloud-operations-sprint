# Confusion Log

Problems encountered during this sprint, what I expected, what actually
happened, the root cause, and the fix. Kept as a record of how issues were
diagnosed, not just that they were solved.

---

## Entry template

**Expected:**
**Actual:**
**Cause:**
**Fix:**
**Lesson:**

---

## 2025-XX-XX — CORS preflight blocked the visitor counter

**Expected:** `fetch()` from the CloudFront page to the API Gateway `/visit`
route would succeed once the Lambda was returning 200.

**Actual:** The footer counter stayed at `—`. The browser console showed a CORS
error. CloudWatch showed the Lambda was never invoked.

**Cause:** The request was failing at the preflight stage, before reaching the
Lambda at all. CORS was not configured on the HTTP API, so the browser rejected
the response before any application code ran.

**Fix:** Configured CORS on the API Gateway HTTP API with the CloudFront origin
allowed for POST.

**Lesson:** "No Lambda invocation in CloudWatch" is itself a diagnostic signal —
it localises the failure to the layer in front of the function. I initially
debugged the Lambda code, which was never the problem.

---

## 2026-XX-XX — Lambda code existed only in the AWS console

**Expected:** The repository contained everything needed to understand and
rebuild the projects.

**Actual:** Five Lambda functions for the order workflow, plus the visitor
counter function, were not in Git at all. The project README claimed the repo
included Lambda source code.

**Cause:** Everything else in this sprint originated somewhere with a natural
path into version control — Terraform and site files from the Linux sandbox,
screenshots from the Windows machine. The Lambda functions were authored
directly in the console, so they never passed through a working directory and
were never staged. The gap was invisible because the deployed functions worked.

**Fix:** Wrote `tools/export_lambdas.sh` to pull the deployed package and a
redacted configuration summary for each function back into the source tree, and
documented that this is a one-way export rather than a deployment pipeline.

**Lesson:** "It works in production" hides the question of where the code
actually lives. The console is a fast place to author and a bad place to store.
Anything created outside a working directory needs a deliberate path back into
version control, or it silently becomes single-copy.

---

## 2026-XX-XX — GitHub Actions reported success on a failed deploy

**Expected:** A failed S3 upload would fail the workflow.

**Actual:** The job was green, but the live site was not updated.

**Cause:** `tools/deploy.py` caught upload exceptions, printed a message, and
then fell through to the end of the script, exiting with code 0. GitHub Actions
only fails a step on a non-zero exit code.

**Fix:** Rewrote the script to collect failures, skip the CloudFront
invalidation if any upload failed, and `sys.exit(1)`. Also added a guard against
invalidating the cache after a zero-file upload.

**Lesson:** Catching an exception is not the same as handling it. An automation
script that cannot fail is a script that cannot be trusted.

---
