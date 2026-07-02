# Releasing Penpot Exporter

Canonical runbook for publishing a new version of the plugin. Written for humans and AI agents
alike — this file is the **single source of truth** for the release process. Follow the numbered
steps in order.

The flow mixes automated CLI steps with irreducible manual GUI steps (the Figma plugin publish and
the community-forum post cannot be automated). Two helper scripts live in
[`scripts/release/`](scripts/release/).

## Prerequisites

- **Release rights:** you must be a maintainer able to (a) merge PRs on
  `penpot/penpot-exporter-figma-plugin`, and (b) publish the plugin in Figma (org publisher access).
- **Tooling:** `gh` (authenticated — `gh auth status`), `nvm`, and `node` per [`.nvmrc`](.nvmrc)
  (currently 24). For the Bitwarden path also `bws` + `jq`.
- **Secrets:** the build needs three secrets, written into two gitignored files:

  | Secret | File | Used by |
  | --- | --- | --- |
  | `VITE_SENTRY_DSN` | `ui-src/.env` | runtime Sentry (`ui-src/metrics/sentry.ts`) |
  | `VITE_MIXPANEL_TOKEN` | `ui-src/.env` | runtime Mixpanel (`ui-src/metrics/mixpanel.ts`) |
  | `SENTRY_AUTH_TOKEN` | `.env.sentry-build-plugin` | build-time source-map upload (`@sentry/vite-plugin`) |

  Get them from the Bitwarden Secrets project (ask a maintainer for the **project ID** and a
  **`BWS_ACCESS_TOKEN`** machine-account token). `scripts/release/ensure-env.sh` bootstraps them —
  see [Step 4](#4-set-up-secret-env-files). Never commit secret values; both files are gitignored.

> **Note for agents:** the shell is non-interactive, so `nvm use` needs nvm sourced first:
> `source "$HOME/.nvm/nvm.sh" && nvm use && <cmd>`.
> Steps that merge a PR or publish to Figma are irreversible — confirm before doing them.

---

## Steps

### 1. Merge the changesets Release PR

The `release.yaml` workflow opens a PR (head branch `changeset-release/main`, title "Release") that
bumps `package.json` + `CHANGELOG.md` from the pending changesets.

```bash
gh pr list --head changeset-release/main --json number,title,url   # find it
```

Review it, then merge. Merging triggers `npx changeset tag`, creating the `vX.Y.Z` git tag.

```bash
gh pr merge <number> --squash --delete-branch
gh run list --workflow release.yaml --limit 3   # wait for the tag workflow
git fetch --tags
```

Record the version `X.Y.Z` — it drives the rest.

### 2. Title the GitHub release `(Version N)`

Releases are titled `vX.Y.Z (Version N)`, where `N` is Figma's sequential publish counter (not
derivable from the semver tag). Derive the next `N` and edit **only** the freshly created release:

```bash
gh release view "vX.Y.Z" --json name --jq .name    # must be the bare "vX.Y.Z" (guard)
N="$(scripts/release/next-version-label.sh)"        # previous max (Version N) + 1
gh release edit "vX.Y.Z" --title "vX.Y.Z (Version $N)"
```

Guard: if the release already has a `(Version …)` suffix, it's already titled — skip. Never retitle
an older release.

### 3. Sync the lockfile

The Release PR bumps `package.json` but not `package-lock.json`; reinstalling syncs it.

```bash
git checkout main && git pull
source "$HOME/.nvm/nvm.sh" && nvm use && npm i
git status --short package-lock.json
```

If `package-lock.json` changed, open its own PR and merge it:

```bash
git checkout -b "release/X.Y.Z"
git commit -am "Release X.Y.Z"        # package-lock.json only
git push -u origin "release/X.Y.Z"
gh pr create --title "Release X.Y.Z" --body "Sync package-lock.json for X.Y.Z." --base main
# after review:
gh pr merge <number> --squash --delete-branch
git checkout main && git pull
```

If it did not change, skip this step.

### 4. Set up secret env files

Bootstrap the two gitignored env files (see [Prerequisites](#prerequisites)):

```bash
# from Bitwarden Secrets (needs BWS_ACCESS_TOKEN exported):
scripts/release/ensure-env.sh <bws-project-id>
# or, without BWS, use/scaffold local files:
scripts/release/ensure-env.sh
```

The script prints each key as `set` / `EMPTY` (never the values) and ends with `OK` (exit 0) or
`NEEDS_FILL` (exit 3). If `NEEDS_FILL`, fill the missing keys in the named file, then re-run until
`OK`. Do not build until it reports `OK`.

### 5. Production build

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && npm run build:prod
```

`build:prod` runs vite in production mode, so `__DEV__` is `false` (no "DEV" badge) and
`@sentry/vite-plugin` uploads source maps (needs `SENTRY_AUTH_TOKEN`).

### 6. Publish in Figma (manual)

Figma's plugin publish is a desktop-app GUI action — it cannot be automated.

1. Open the plugin in Figma **dev mode**. Verify: **no "DEV" badge** and the footer shows `vX.Y.Z`.
   (If the badge shows or the version is wrong, the prod build didn't load — recheck Step 5.)
2. Plugin → **⋯** → **Publish**.
3. Paste the changelog (write a concise, user-facing bullet list from the release notes:
   `gh release view vX.Y.Z --json body --jq .body`; match the previous release's style — short
   bullets, no PR/commit links).
4. Tick **"I agree to the community terms of service"** if it appears.
5. **Contributors must be EMPTY** — remove anyone listed.
6. Publish.

### 7. Announce in the community forum

Post a **reply** (not a new topic) in
<https://community.penpot.app/t/figma-to-penpot-export-plugin/5554>, using the template below.

---

## Community announcement template

Translate the changesets entries into user benefits — this is **not** the raw changelog. Map
**Minor changes → Highlights** (lead with these); fold user-visible **Patch changes** into a
Highlight bullet or into "What to expect?"; skip purely internal patches.

**Formatting** (verified against the rendered 0.24.0 post — Discourse markdown):

- Use `:emoji:` shortcodes, never literal emoji.
- **Title line is bold**, prefixed `:tada:`, em-dash glued to the version:
  `:tada: **Penpot Exporter X.Y.Z— <Hook>!**`
- Greeting `Hey everyone :waving_hand:`; bold the product name inline in the intro.
- Highlights header bold: `:rocket: **Highlights**`.
- Each highlight is a bullet (`*`) with an emoji + **bold** feature name and colon:
  `* :emoji: **Feature name:** description.` Inline-code identifiers like `` `createImageBitmap` ``.
- Section labels bold: `:stopwatch: **What to expect?**`, `:speech_balloon: **We'd love your feedback!**`.
- Close with the bare issues URL — Discourse oneboxes it as "GitHub · Where software is built":
  `https://github.com/penpot/penpot-exporter-figma-plugin/issues`

Per-feature emoji palette: `:milky_way:` `:high_voltage:` `:hammer_and_wrench:` `:triangular_ruler:`
`:bar_chart:` `:puzzle_piece:` `:film_projector:` `:dart:` `:sparkles:`.

**Gold reference — the real, rendered 0.24.0 post (copy its shape):**

```
:tada: **Penpot Exporter 0.24.0— FigJam Support and Major Performance Optimizations!**

Hey everyone :waving_hand:

We're back with a brand new update that opens up completely new workflows and introduces important stability tweaks under the hood. The **Penpot Exporter 0.24.0** is here to make your migrations smoother and more reliable!

:rocket: **Highlights**

* :milky_way: **FigJam Files Support:** This release introduces an exciting new feature: support for FigJam files! You can now export your stickies and connectors directly into editable Penpot shapes, preserving your brainstorming sessions.

* :high_voltage: **Faster Image Exports:** We've optimized exports for image-heavy files. By fetching image bytes from Figma using a small concurrency pool instead of one at a time, your project exports should now be noticeably faster.

* :hammer_and_wrench: **Better Memory Management:** Large, image-heavy files were causing some export crashes due to high memory usage. To mitigate this, we've lowered peak memory during the process by decoding images with `createImageBitmap` (releasing pixels deterministically) and buffering the output zip as Blobs instead of keeping it all on the JS heap. We also fixed a specific crash on grids with non-finite numeric values (like those from deleted variables).

:stopwatch: **What to expect?** A brand new capability to bring your FigJam boards over to Penpot, along with a more robust and efficient experience when handling larger files.

:speech_balloon: **We'd love your feedback!** Try exporting your FigJam files and heavy projects, and let us know how these performance tweaks work for your team. If you encounter any issues or edge cases, please report them here so we can keep polishing the plugin: https://github.com/penpot/penpot-exporter-figma-plugin/issues
```

---

## Helper scripts

| Script | What it does |
| --- | --- |
| [`scripts/release/next-version-label.sh`](scripts/release/next-version-label.sh) | Prints the next Figma `(Version N)` = highest existing `(Version N)` in `gh release` titles + 1. |
| [`scripts/release/ensure-env.sh`](scripts/release/ensure-env.sh) | Bootstraps the two secret env files from Bitwarden Secrets (`ensure-env.sh <project-id>`, needs `BWS_ACCESS_TOKEN`) or scaffolds/verifies local files (no arg). Prints key status, never values; exits `OK`/`NEEDS_FILL`. |
