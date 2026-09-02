---
'penpot-exporter': patch
---

Allow self-hosted Penpot instance URLs in the External Libraries field. The URL validation no longer requires "penpot" in the domain, so on-prem installations (e.g. http://localhost:9001) can link external libraries. Fixes #398.
