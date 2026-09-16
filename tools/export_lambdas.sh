#!/usr/bin/env bash
#
# Export console-authored Lambda functions back into version control.
#
# These functions were written directly in the AWS console rather than
# deployed from this repo, so this script pulls the deployed package back
# down and unzips it into the project source tree.
#
# Environment variable VALUES are never exported - only their names.
#
# Usage:  AWS_PROFILE=<profile> ./tools/export_lambdas.sh
#
set -euo pipefail

REGION="${AWS_REGION:-ap-northeast-1}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# format:  function-name:destination-directory (relative to repo root)
FUNCTIONS=(
  "project3-order-publisher:projects/event-driven-order-processing-workflow/src"
  "project3-order-processor:projects/event-driven-order-processing-workflow/src"
  "project3-order-status:projects/event-driven-order-processing-workflow/src"
  "project3-order-notifier:projects/event-driven-order-processing-workflow/src"
  "project3-emergency-disable-demo:projects/event-driven-order-processing-workflow/src"
  "VisitorCounterFunction:backend/visitor-counter/src"
  "visitor-counter-emergency-disable:backend/visitor-counter/src"
)

for entry in "${FUNCTIONS[@]}"; do
  fn="${entry%%:*}"
  dest="$REPO_ROOT/${entry##*:}/$fn"

  echo "==> $fn"

  if ! aws lambda get-function --function-name "$fn" --region "$REGION" >/dev/null 2>&1; then
    echo "    SKIPPED: function not found in $REGION (check the exact name)"
    continue
  fi

  tmp="$(mktemp -d)"
  url="$(aws lambda get-function --function-name "$fn" --region "$REGION" \
          --query 'Code.Location' --output text)"

  curl -sS -o "$tmp/code.zip" "$url"
  mkdir -p "$dest"
  unzip -oq "$tmp/code.zip" -d "$dest"

  aws lambda get-function-configuration --function-name "$fn" --region "$REGION" \
    > "$tmp/config.json"

  python3 - "$tmp/config.json" "$dest/function-config.json" <<'PY'
import json, sys

source, destination = sys.argv[1], sys.argv[2]
config = json.load(open(source))
env = (config.get("Environment") or {}).get("Variables") or {}

json.dump({
    "FunctionName": config.get("FunctionName"),
    "Runtime": config.get("Runtime"),
    "Handler": config.get("Handler"),
    "MemorySize": config.get("MemorySize"),
    "Timeout": config.get("Timeout"),
    "Architectures": config.get("Architectures"),
    "ExecutionRole": (config.get("Role") or "").rsplit("/", 1)[-1],
    "EnvironmentVariableNames": sorted(env.keys()),
    "_note": "Environment variable VALUES are intentionally not exported."
}, open(destination, "w"), indent=2)

open(destination, "a").write("\n")
PY

  rm -rf "$tmp"
  echo "    -> ${entry##*:}/$fn"
done

echo
echo "Done. Review the exported files before committing."
