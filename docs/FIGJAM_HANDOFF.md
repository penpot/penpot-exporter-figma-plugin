# FigJam export — handoff / context for next session

> Temporary doc to preserve context across `/compact`. Safe to delete once the work is merged.

## Where we are

- **Branch**: `feature/figma-figjam` (forked from `feature/figma-slides`, which is PR
  [#374](https://github.com/penpot/penpot-exporter-figma-plugin/pull/374)).
- **Goal**: mirror the slides PR exercise for **FigJam** `.jam` files — export to `.penpot` with
  reasonable structural and visual fidelity, reusing the slides architecture.
- **Status**: v1 working end-to-end (manual smoke test in real FigJam file passed). Several visual
  quick-wins applied. A few intentional limitations remain.

## Reference docs

- Plan file (approved): `/Users/o105/.claude/plans/esta-rama-sale-de-luminous-seahorse.md`
- Research report (FigJam node types + Penpot mapping):
  `/Users/o105/.claude/plans/esta-rama-sale-de-luminous-seahorse-agent-aefaf56177f73fd76.md`
- Changeset (minor): `.changeset/figma-figjam-support.md`
- Slides PR description (reference architecture):
  `gh pr view 374 --repo penpot/penpot-exporter-figma-plugin`

## What got built

### New files

- `plugin-src/transformers/transformFigJamDocumentNode.ts` — document transformer (multi-page via
  `processPages`, skips tokens/paintStyles/textStyles).
- `plugin-src/transformers/transformStickyNode.ts` — sticky → Penpot frame + child text inset 24px +
  cornerRadius 8.
- `plugin-src/transformers/transformConnectorNode.ts` — connector → Penpot `path` with native arrow
  stroke caps; STRAIGHT/ELBOWED/CURVED geometry; group + label chip when text present.
- `plugin-src/translators/translateConnectorStrokeCap.ts` — Figma `ConnectorStrokeCap` → Penpot
  `StrokeCaps` mapping (ERD\_\* → `line-arrow`).
- Tests: `tests/plugin-src/transformers/{transformStickyNode,transformConnectorNode}.test.ts`,
  `tests/plugin-src/translators/translateConnectorStrokeCap.test.ts`.
- `.changeset/figma-figjam-support.md` (minor bump).

### Modified files

- `manifest.json` — `"editorType": ["figma", "slides", "figjam"]`.
- `plugin-src/utils/editorType.ts` — `isFigJamEditor()` helper (defensive against missing `figma`
  global in tests).
- `plugin-src/code.ts` — `teamLibrary` round-trip gated for FigJam too.
- `plugin-src/handleMessage.ts` — routes FigJam to `transformFigJamDocumentNode`.
- `plugin-src/processors/processPages.ts` — overrides progress labels (`'FigJam board scanned 🎨'` /
  `'Scan FigJam board'`) when in FigJam editor.
- `plugin-src/transformers/transformSceneNode.ts` — STICKY → `transformStickyNode`, CONNECTOR →
  `transformConnectorNode`, raster fallback for
  HIGHLIGHT/STAMP/WASHI_TAPE/WIDGET/EMBED/LINK_UNFURL/MEDIA/CODE_BLOCK.
- `plugin-src/transformers/transformNodeAsImageRect.ts` — `RasterizableNode` union extended;
  `hasBlend` guard for nodes lacking `MinimalBlendMixin` (WIDGET/EMBED/LINK_UNFURL/MEDIA).
- `plugin-src/transformers/transformFrameNode.ts` — SECTION in FigJam → hardcoded cornerRadius +
  derived stroke (see below).
- `plugin-src/transformers/index.ts`, `plugin-src/translators/index.ts` — new barrel exports.
- `plugin-src/translators/fills/translateFills.ts` — `translateFillStyleId` bails out in FigJam (no
  design styles concept).
- `plugin-src/transformers/partials/transformFills.ts` — `hasFillStyle` returns `false` in FigJam,
  so node colors come from `node.fills` directly with no dangling `fillStyleId`.
- `plugin-src/translators/text/translateTextSegments.ts` — same idea for text: `hasTextStyle`
  returns `false` in FigJam.
- `ui-src/components/ExportForm.tsx` — hides `DesignExportControls` for FigJam (matches slides
  behaviour).
- `ui-src/context/useFigma.ts` — forces `exportScope='all'` when FigJam editor.

## Critical bug fixes uncovered during smoke testing

### 1. `figma.getStyleByIdAsync` undefined in FigJam → export crashed

Symptom: "TypeError: not a function" at `qi` (processPaintStyles) during export.

Cause: `translateFillStyleId` populated the `paintStyles` Map when a FigJam node exposed a
`fillStyleId` (FigJam nodes DO carry that property even though the editor has no real paint-style
concept). Then `processPaintStyles` iterated the Map and called `figma.getStyleByIdAsync`, which
doesn't exist in FigJam runtime.

Fix:

- `hasFillStyle` returns `false` in FigJam → falls through to inline `fills`.
- `hasTextStyle` same treatment for textStyleId.
- `translateFillStyleId` returns `undefined` in FigJam as defence in depth.

### 2. Connector position resolution was in the wrong coordinate space → divider line missing / off-canvas

Symptom: the green horizontal divider line from `Team meeting agenda` template didn't appear (or
appeared offscreen).

Cause: `ConnectorEndpoint.position` is in the connector's **parent** coordinate space (same space as
the connector's `relativeTransform`), not absolute page coordinates. My code treated it as absolute,
drawing the path ~6000px outside the actual node.

Fix: in `resolveEndpoint`, apply
`parentAbsoluteOffset = connector.absoluteTransform[i][2] - connector.relativeTransform[i][2]` to
every position-based endpoint. Magnet+endpointNodeId branch still uses `absoluteBoundingBox`
directly (already in absolute space).

## Quick-wins applied for visual parity

### Sticky cornerRadius

- `transformStickyNode.ts`: `STICKY_CORNER_RADIUS = 8` applied to all four corners.
- Reason: stickies in FigJam UI always have rounded corners; API doesn't expose `cornerRadius` for
  stickies.

### Section cornerRadius

- `transformFrameNode.ts`: `FIGJAM_SECTION_CORNER_RADIUS = 16` applied to all four corners **only
  when** the node is a `SECTION` and `isFigJamEditor()` is true.
- Reason: `SectionNode` doesn't extend `CornerMixin` in Figma's type system. Confirmed Figma
  platform gap (open forum thread).

### Section stroke (derived from fill)

- `transformFrameNode.ts` → `getSectionStroke(node)`:
  - Find first visible `SolidPaint` in `node.fills`.
  - Multiply RGB by `FIGJAM_SECTION_STROKE_DARKEN = 0.85` (15% darker), `rgbToHex`, use as
    `strokeColor`.
  - `strokeOpacity = solidFill.opacity ?? 1`, `strokeWidth = 2`, `strokeAlignment = 'inner'`.
  - Fallback when there's no solid fill: `#000000` at 12% opacity, 2px width.
- Reason: `SectionNode` doesn't extend `MinimalStrokesMixin`. Confirmed Figma platform gap
  (forum.figma.com/t/why-are-strokes-not-available-on-section-nodes/41658).
- Tunables to revisit if visual still off:
  - `FIGJAM_SECTION_STROKE_DARKEN` — lower = darker. Currently 0.85.
  - `FIGJAM_SECTION_STROKE_WIDTH` — currently 2. FigJam visual is somewhere between 1 and 2px.

## Visual comparisons + verdicts (Figma vs Penpot, "Team meeting agenda" template)

| Issue                                                                                                                                          | Verdict                                                                                                                                                                                                                    | Status                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Handwritten font ("GOOD FOR", "PEOPLE", "MORE TEMPLATES") rendered as serif fallback in Penpot                                                 | Not a bug — plugin sends `fontFamily` correctly via `getStyledTextSegments`. Penpot doesn't have the FigJam handwriting fonts installed. Plugin already reports `missingFonts`. User must upload the fonts to Penpot team. | Won't fix — document as font-availability requirement                  |
| Horizontal green divider line missing                                                                                                          | Was a real bug — connector position in wrong coord space                                                                                                                                                                   | Fixed                                                                  |
| Green panel rounded corners missing                                                                                                            | SECTION in FigJam has implicit rounded corners not exposed by API                                                                                                                                                          | Quick-win: hardcoded radius 16                                         |
| Section border missing                                                                                                                         | SECTION in FigJam has implicit 1–2px border derived from fill, not exposed by API                                                                                                                                          | Quick-win: derived from fill via `rgbToHex(fill × 0.85)`, 2px          |
| Bullet point in list — Figma puts the bullet outside the text block with hanging indent; Penpot puts it inside the flow with heavy left indent | Penpot's list renderer interpretation. We send Figma `listOptions` correctly.                                                                                                                                              | Out of scope for v1 — document as cross-tool list rendering difference |

## Verification commands (currently green)

```bash
npm run lint           # ESLint: No issues
npm run lint:tsc-plugin
npm run lint:tsc-ui
npm run test:run       # 31 files / 231 tests passing
npm run build          # plugin + UI build OK
```

Tests cover: sticky frame structure + padding + empty-text branch; connector PathShape/GroupShape,
STRAIGHT + ELBOWED content, magnet endpoint resolution, unresolvable endpoint skip; full
`ConnectorStrokeCap` enum mapping including ERD fallback.

## Open / candidate follow-ups (not blocking)

1. **Sticky author footer** — `authorVisible` / `authorName` ignored. Could render as a smaller text
   child below the body text when `authorVisible === true`.
2. **Connector ERD caps** — currently fall back to `line-arrow`. Could render the actual ERD glyph
   as a custom SVG cap or as an additional small `svg-raw` shape attached at the endpoint.
3. **Stuck-node semantics** — `stuckTo`, `stuckNodes`, `attachedConnectors` not preserved.
   Position-accurate but anchors lost. Penpot has no concept; would need to model as Penpot
   constraints or interactions.
4. **MEDIA original bytes** — Plugin API only exposes a poster frame via `exportAsync`. Real
   video/audio bytes not retrievable.
5. **`CODE_BLOCK` editable** — currently rasterized. Could emit `frame` (dark fill) + `text` child
   with monospace font for editable code (no syntax highlighting, out of scope).
6. **`SHAPE_WITH_TEXT` geometric** — currently rasterized (inherited from slides PR). Could upgrade
   to geometric shapes (rect/circle/path) with a child text shape; needs an SVG lookup table for ~25
   non-trivial `shapeType` values (diamond, hexagon, ENG\_\*, etc.).
7. **`TABLE` geometric** — currently rasterized. Could emit a frame-grid with text children; Penpot
   has no native table.
8. **Bullet point indentation** — see `listOptions` in segments; could tweak the emitted paragraph
   `indentation` for FigJam to nudge Penpot's rendering closer to Figma's. Risk: regression in
   design files. Out of scope unless we gate via `isFigJamEditor()`.
9. **Sticky padding heuristic** — `STICKY_PADDING = 24` hardcoded. FigJam visual padding scales with
   font size; could compute from `fontSize` at runtime.
10. **Section padding heuristic** — FigJam sections appear to clip their children with a small outer
    padding visually; we don't replicate that.

## Useful entry points for the next session

- To inspect a node's type when debugging visual differences: temporary `console.warn` in
  `plugin-src/transformers/transformSceneNode.ts` works well (we used a "first occurrence per type"
  pattern to avoid console flood — see git history for that diff if needed).
- Plugin dev console: in Figma, `Plugins → Development → Open console` **before** running the
  plugin; reimport the plugin via `Plugins → Development → Reimport plugin from manifest` after
  every build.
- Authoritative source for FigJam node type signatures:
  `node_modules/@figma/plugin-typings/plugin-api-standalone.d.ts` (specifically lines 5275–5314 for
  `ConnectorEndpoint`/`ConnectorStrokeCap`, 9869–9914 for `StickyNode`/`StampNode`, 10974–11008 for
  the full `SceneNode` union). The public Figma docs occasionally 404 or lag behind the bundled
  `.d.ts`.

## Conventions reminded for next session

- All transformers return Penpot shapes via partial spreads. Reuse existing partials
  (`transformIds`, `transformFills`, etc.) whenever the source mixin matches.
- `PathShape` has no `x/y/width/height` — Penpot derives bounds from `selrect` + `content`. Set
  `selrect` explicitly.
- `transformBlend` requires `MinimalBlendMixin`. WIDGET/EMBED/LINK_UNFURL/MEDIA lack it — use the
  `hasBlend` guard from `transformNodeAsImageRect.ts`.
- `translateStrokes` accepts `MinimalStrokesMixin` directly (no `GeometryMixin` required) and takes
  a `strokeCaps` callback per stroke.
- Penpot stroke caps live in `ui-src/lib/types/utils/stroke.ts`:
  `'round' | 'square' | 'line-arrow' | 'triangle-arrow' | 'square-marker' | 'circle-marker' | 'diamond-marker'`.
