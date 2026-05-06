---
'penpot-exporter': minor
---

Add initial support for Figma Slides files (.deck): the plugin now appears in the Plugins menu of Slides documents and exports the deck as a single Penpot page where each slide becomes a 1920x1080 frame.

Slides-only data that is intentionally **not** exported in this version:

- Slide transitions (`getSlideTransition()`).
- Speaker notes.
- `isSkippedSlide` flag (skipped slides are still exported).
- `INTERACTIVE_SLIDE_ELEMENT` (polls, embeds, YouTube videos).

Slides-specific node types that may appear inside a slide and are currently **dropped with a console warning** (same behaviour as in design files):

- `TABLE`
- `SHAPE_WITH_TEXT`
- Animated GIFs created via `createGif()`

The export-scope selector and external libraries section are hidden in Slides since neither concept exists there.
