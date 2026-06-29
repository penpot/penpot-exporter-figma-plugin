---
name: publish-release
description: >
  Assistant to publish a new version of the Penpot Exporter Figma plugin end-to-end:
  merge the changesets Release PR, title the GitHub release "(Version N)", regenerate the
  lockfile PR, bootstrap secret env files (Bitwarden Secrets / bws, with fallback), run
  build:prod, guide the Figma plugin publish, and draft the community-forum announcement.
  Use when the user says "publish a release", "new plugin version", "release the plugin",
  "ship the plugin", or invokes "/publish-release".
version: 0.1.0
user-invocable: true
---

# Publish Release

Walks the Penpot Exporter Figma plugin through a full release. **Hybrid automation:** auto-run the
reversible steps; stop at every **🛑 CONFIRM** gate and get an explicit "yes" before doing the
irreversible thing (merging a PR, publishing to Figma).

> **The 🛑 CONFIRM gates are instructions you follow, not code-enforced locks.** This file only
> *guides* you — nothing technically prevents a mutating command. So: before any step that writes
> to GitHub, Figma, Sentry, or the repo, show what you're about to do and wait for an explicit "yes".

Create one todo per phase and work them in order. Announce the phase before acting.

## 🔒 Security — non-negotiable

- Real secret values live ONLY in Bitwarden Secrets and in the gitignored files
  `ui-src/.env` and `.env.sentry-build-plugin`.
- NEVER write a secret value into any tracked file, this skill, a commit, a PR body, or chat output.
- The env scripts print key names + a set/empty status only — keep it that way.

## Environment notes

- The tool shell is **non-interactive**, so `nvm use` fails unless you source nvm first. Every node
  step must be prefixed: `source "$HOME/.nvm/nvm.sh" && nvm use && <cmd>`.
- `gh` must be authenticated (`gh auth status`). `.nvmrc` pins node 24.
- Script paths below are relative to the repo root.

---

## Phase 0 — Preflight

```bash
git fetch --all --prune
git status --short            # working tree should be clean
gh auth status
```

- Resolve the target version `X.Y.Z`: it is the version the open Release PR will set in
  `package.json` (see Phase 1). If unsure, read it from the Release PR diff.
- Source nvm once and confirm node: `source "$HOME/.nvm/nvm.sh" && nvm use && node -v`.

## Phase 1 — Merge the changesets Release PR 🛑 CONFIRM

The `release.yaml` workflow opens a PR (head branch `changeset-release/main`, title "Release") that
bumps `package.json` + `CHANGELOG.md`. Find and review it:

```bash
gh pr list --head changeset-release/main --json number,title,url,headRefName
# fallback if empty:
gh pr list --search "Release in:title" --json number,title,url
```

Show the PR + its diff summary to the user. **Wait for explicit confirmation**, then:

```bash
gh pr merge <number> --squash --delete-branch
```

Merging triggers `release.yaml` again, which runs `npx changeset tag` and creates the `vX.Y.Z` tag.
Wait for it before Phase 2:

```bash
gh run list --workflow release.yaml --limit 3
git fetch --tags
git tag --list "vX.Y.Z"        # should now exist
```

## Phase 2 — Title the GitHub release `(Version N)`

**Guard first** — only ever retitle the *freshly created* release, never an older one. This is the
step most likely to mutate the wrong thing, so check before editing:

```bash
# 1. target must exist (created by the tag workflow in Phase 1)
CUR="$(gh release view "vX.Y.Z" --json name --jq .name)" \
  || { echo "Release vX.Y.Z not found — wait for the tag workflow, do NOT edit anything else."; }
echo "Current title: $CUR"
```

- If `CUR` already contains `(Version ` → **already titled; skip Phase 2** (do not re-edit).
- If the release does not exist → stop; the tag workflow hasn't finished. Never retitle a different
  (older) release as a substitute.
- Only when `CUR` is the bare `vX.Y.Z` (no `(Version …)`): compute `N`, **show the before/after
  title**, and edit:

```bash
N="$(.claude/skills/publish-release/scripts/next-version-label.sh)"
echo "Retitle:  $CUR  ->  vX.Y.Z (Version $N)"   # show, then proceed
gh release edit "vX.Y.Z" --title "vX.Y.Z (Version $N)"
gh release view "vX.Y.Z" --json name,tagName       # verify
```

Remember `X.Y.Z` and `N` — they feed the Figma changelog and the community post.

## Phase 3 — Lockfile PR

The Release PR bumps `package.json` but not `package-lock.json`; reinstalling syncs the lockfile.

```bash
git checkout main && git pull
source "$HOME/.nvm/nvm.sh" && nvm use && npm i
git status --short package-lock.json
```

- If `package-lock.json` is **unchanged**: say so and skip the rest of this phase.
- If it **changed**: 🛑 CONFIRM, then open its own PR:

```bash
git checkout -b "release/X.Y.Z"
git add package-lock.json
git commit -m "Release X.Y.Z"
git push -u origin "release/X.Y.Z"
gh pr create --title "Release X.Y.Z" --body "Sync package-lock.json for X.Y.Z." --base main
```

After the user approves, merge and return to main:

```bash
gh pr merge <number> --squash --delete-branch
git checkout main && git pull
```

## Phase 4 — Secret env files (BWS or fallback)

Ask the user once: **"BWS project ID? (paste it, or say skip)"**

```bash
# with a project id (requires BWS_ACCESS_TOKEN exported in the shell):
.claude/skills/publish-release/scripts/ensure-env.sh "<project-id>"
# or fallback (use/scaffold local files):
.claude/skills/publish-release/scripts/ensure-env.sh
```

- Last line `OK` → continue.
- Last line `NEEDS_FILL` (exit 3) → **pause**, tell the user exactly which keys are empty and in
  which file, wait for them to fill the values, then re-run the script. Do not proceed until `OK`.

## Phase 5 — Production build

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && npm run build:prod
```

Report success/failure from the output. A clean prod build (mode=production) sets `__DEV__=false`,
so the footer shows no "DEV" badge.

## Phase 6 — Draft the Figma changelog

From the release notes (`gh release view vX.Y.Z --json body`) write a concise, user-facing bullet
list for the Figma publish dialog — match the prior release's style (short bullets, no PR/commit
links). Save it for the user to copy:

```bash
gh release view "vX.Y.Z" --json body --jq .body   # source material
```

Write the draft to `scratchpad`/a temp file and show it inline.

## Phase 7 — Publish in Figma (manual — guided) 🛑 CONFIRM

The model cannot drive the Figma app. Present this checklist and the Phase 6 draft, then wait:

1. Open the plugin in Figma **dev mode**. Verify: **no "DEV" badge** and footer shows `vX.Y.Z`.
   (If the badge shows or the version is wrong, the prod build didn't load — recheck Phase 5.)
2. Plugin → **⋯** → **Publish**.
3. Paste the Figma changelog draft.
4. Tick **"I agree to the community terms of service"** if it appears.
5. **Contributors must be EMPTY** — remove anyone listed.
6. Publish.

Confirm with the user once it's published before Phase 8.

## Phase 8 — Community announcement (guided)

Fill `references/community-post-template.md` from the release changelog (Minor → Highlights,
user-visible Patch → "What to expect?"). Show the finished reply and the thread URL
<https://community.penpot.app/t/figma-to-penpot-export-plugin/5554>; the user posts it as a reply.

---

## Quick reference

| Need | Command |
| --- | --- |
| Next `(Version N)` | `.claude/skills/publish-release/scripts/next-version-label.sh` |
| Ensure secrets | `.claude/skills/publish-release/scripts/ensure-env.sh [project-id]` |
| Release PR | `gh pr list --head changeset-release/main` |
| Release notes | `gh release view vX.Y.Z --json body --jq .body` |
| Node step | `source "$HOME/.nvm/nvm.sh" && nvm use && <cmd>` |
