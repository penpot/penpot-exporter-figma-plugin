#!/usr/bin/env bash
# Derive the next Figma "(Version N)" label from existing GitHub release titles.
#
# Release titles follow the pattern:  vX.Y.Z (Version N)
# The "Version N" is Figma's sequential publish counter and is NOT derivable from
# the semver tag, so we read the highest N already used and add 1.
#
# Output: the next integer N on stdout (nothing else). Errors go to stderr.
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not found." >&2
  exit 1
fi

# Pull release titles, extract the integer inside "(Version N)", take the max.
max="$(gh release list --limit 50 --json name --jq '.[].name' 2>/dev/null \
  | grep -oE '\(Version [0-9]+\)' \
  | grep -oE '[0-9]+' \
  | sort -n \
  | tail -1 || true)"

if [[ -z "${max:-}" ]]; then
  echo "ERROR: could not parse any '(Version N)' from release titles." >&2
  echo "Inspect 'gh release list' and pass the number manually." >&2
  exit 2
fi

echo "$((max + 1))"
