---
'penpot-exporter': patch
---

Fix "expected valid color" export failures: style names ending in "/" no longer produce empty asset names, and degenerate gradient transforms (handles almost on the same point) no longer produce coordinates outside the range Penpot accepts.
