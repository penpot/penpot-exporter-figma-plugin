---
'penpot-exporter': minor
---

Add initial support for FigJam (`.jam`) files: the plugin now appears in the Plugins menu of FigJam boards and exports the board to a `.penpot` file with multi-page fidelity (each FigJam page becomes a Penpot page).

Native (editable) mappings:

- **Sticky notes** (`STICKY`) → Penpot `frame` with the sticky color as fill plus a child `text` shape inset by 24px.
- **Connectors** (`CONNECTOR`) → Penpot `path` with endpoint resolution (free position, attached node + magnet, AUTO direction), straight / elbowed / curved geometry, and native arrow stroke caps (`triangle-arrow`, `line-arrow`, `diamond-marker`, `circle-marker`). Connectors with text labels are wrapped in a `group` with a background chip + text shape at the midpoint.
- **Sections** (`SECTION`) → already mapped to a Penpot `frame` (reused from the existing pipeline).

Rasterized (image fill) fallbacks for node types Penpot cannot model natively:

- `HIGHLIGHT`, `STAMP`, `WASHI_TAPE`, `WIDGET`, `EMBED`, `LINK_UNFURL`, `MEDIA`, `CODE_BLOCK`, `TABLE`, `SHAPE_WITH_TEXT`.

Intentional limitations in this first iteration:

- Sticky `authorVisible` / `authorName` ignored.
- `ERD_*` connector caps fall back to `line-arrow` (no Penpot equivalent).
- Stuck-node relationships (`stuckTo`, `stuckNodes`, `attachedConnectors`) not preserved — connectors are positionally accurate but lose anchor semantics.
- `MEDIA` exports only the still poster frame (Plugin API doesn't expose original video/audio bytes).
- `WIDGET.widgetSyncedState` discarded; widgets become flat images.
- `CODE_BLOCK` becomes a flat image (no syntax highlighting, not editable).
- Tokens, paint styles, text styles and external libraries are not exported (none exist in FigJam files).

The export-scope selector and external libraries section are hidden in FigJam, matching the Slides behaviour.
