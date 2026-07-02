#!/usr/bin/env bash
# Ensure the plugin's secret env files exist and are populated.
#
#   ui-src/.env                 VITE_SENTRY_DSN, VITE_MIXPANEL_TOKEN   (runtime, vite)
#   .env.sentry-build-plugin    SENTRY_AUTH_TOKEN                       (build-time, @sentry/vite-plugin)
#
# Both files are gitignored. This script writes secrets ONLY into them.
#
# Mode A (BWS):  pass a Bitwarden Secrets project ID as $1 -> fetch via `bws`,
#               requires BWS_ACCESS_TOKEN in the environment + `jq`.
# Mode B (fallback): no project ID -> use the existing files, or scaffold empty
#               ones from ui-src/.env.example and ask you to fill them.
#
# Never prints secret VALUES — only key names and a set/empty status.
# Exit 0 + final line "OK" when every required key is non-empty.
# Exit 3 + final line "NEEDS_FILL" when something is still empty.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
UI_ENV="$ROOT/ui-src/.env"
UI_ENV_EXAMPLE="$ROOT/ui-src/.env.example"
SENTRY_ENV="$ROOT/.env.sentry-build-plugin"

PROJECT_ID="${1:-}"

read_env_value() {
  # $1=key $2=file -> echoes the value (empty if file/key absent)
  [[ -f "$2" ]] || { echo ""; return; }
  local line
  line="$(grep -E "^${1}=" "$2" 2>/dev/null | tail -1 || true)"
  echo "${line#*=}"
}

set_env_value() {
  # $1=key $2=value $3=file  (creates file if missing; replaces existing key)
  local key="$1" val="$2" file="$3"
  touch "$file"
  if grep -qE "^${key}=" "$file" 2>/dev/null; then
    grep -vE "^${key}=" "$file" > "$file.tmp" || true
    printf '%s=%s\n' "$key" "$val" >> "$file.tmp"
    mv "$file.tmp" "$file"
  else
    printf '%s=%s\n' "$key" "$val" >> "$file"
  fi
}

fetch_from_bws() {
  command -v bws >/dev/null 2>&1 || { echo "ERROR: bws CLI not found." >&2; exit 1; }
  command -v jq  >/dev/null 2>&1 || { echo "ERROR: jq not found (needed to parse bws output)." >&2; exit 1; }
  if [[ -z "${BWS_ACCESS_TOKEN:-}" ]]; then
    echo "ERROR: BWS_ACCESS_TOKEN is not set." >&2
    echo "Export your Bitwarden Secrets machine-account token first:" >&2
    echo "  export BWS_ACCESS_TOKEN=..." >&2
    exit 1
  fi

  local json
  json="$(bws secret list "$PROJECT_ID" -o json)" \
    || { echo "ERROR: 'bws secret list $PROJECT_ID' failed." >&2; exit 1; }

  get() { echo "$json" | jq -r --arg k "$1" '.[] | select(.key==$k) | .value' | head -1; }

  local dsn mix sentry
  dsn="$(get VITE_SENTRY_DSN)"
  mix="$(get VITE_MIXPANEL_TOKEN)"
  sentry="$(get SENTRY_AUTH_TOKEN)"

  [[ -n "$dsn"    ]] && set_env_value VITE_SENTRY_DSN    "$dsn"    "$UI_ENV"     || echo "  (BWS: VITE_SENTRY_DSN not found in project)" >&2
  [[ -n "$mix"    ]] && set_env_value VITE_MIXPANEL_TOKEN "$mix"   "$UI_ENV"     || echo "  (BWS: VITE_MIXPANEL_TOKEN not found in project)" >&2
  [[ -n "$sentry" ]] && set_env_value SENTRY_AUTH_TOKEN  "$sentry" "$SENTRY_ENV" || echo "  (BWS: SENTRY_AUTH_TOKEN not found in project)" >&2
}

scaffold_fallback() {
  if [[ ! -f "$UI_ENV" ]]; then
    if [[ -f "$UI_ENV_EXAMPLE" ]]; then
      cp "$UI_ENV_EXAMPLE" "$UI_ENV"
      echo "Created $UI_ENV from .env.example"
    else
      printf 'VITE_SENTRY_DSN=\nVITE_MIXPANEL_TOKEN=\n' > "$UI_ENV"
      echo "Created empty $UI_ENV"
    fi
  fi
  if [[ ! -f "$SENTRY_ENV" ]]; then
    printf 'SENTRY_AUTH_TOKEN=\n' > "$SENTRY_ENV"
    echo "Created empty $SENTRY_ENV"
  fi
}

verify_and_exit() {
  local ok=1
  check() {
    local val
    val="$(read_env_value "$1" "$2")"
    if [[ -n "$val" ]]; then
      echo "  $1: set"
    else
      echo "  $1: EMPTY  -> fill in $2"
      ok=0
    fi
  }
  echo "Secret status:"
  check VITE_SENTRY_DSN    "$UI_ENV"
  check VITE_MIXPANEL_TOKEN "$UI_ENV"
  check SENTRY_AUTH_TOKEN   "$SENTRY_ENV"
  if [[ "$ok" -eq 1 ]]; then echo "OK"; exit 0; else echo "NEEDS_FILL"; exit 3; fi
}

if [[ -n "$PROJECT_ID" ]]; then
  echo "Fetching secrets from Bitwarden Secrets project $PROJECT_ID ..."
  fetch_from_bws
else
  echo "No BWS project ID given — using/creating local env files."
  scaffold_fallback
fi

verify_and_exit
