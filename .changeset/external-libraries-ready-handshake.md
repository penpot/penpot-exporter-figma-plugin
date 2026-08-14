---
'penpot-exporter': patch
---

Fix external library detection: the library list is now sent to the UI after it signals ready, so the prompt to link Penpot libraries no longer disappears when the team library data resolves before the UI has loaded.
