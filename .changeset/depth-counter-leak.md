---
'penpot-exporter': patch
---

Restore the internal nesting-depth counter with try/finally so an export aborted by an error no longer leaks state into the next export.
