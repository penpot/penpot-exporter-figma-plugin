---
'penpot-exporter': patch
---

Fix crash and visual mismatch when Figma reports an invalid vector network. Strokes now access `vectorNetwork` safely, and vector nodes whose network or paths cannot be read fall back to a rasterized PNG image so the exported shape matches the Figma preview.
