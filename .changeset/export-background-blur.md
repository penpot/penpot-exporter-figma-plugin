---
'penpot-exporter': minor
---

Add an opt-in "Background blur" export option. Figma's `BACKGROUND_BLUR` effect was silently
dropped before; with the checkbox enabled it is exported as Penpot's `background-blur` shape
attribute. The effect is only painted by Penpot's WebGL renderer (2.17 or newer with "WebGL
rendering (beta)" enabled), which is why it stays off by default.
