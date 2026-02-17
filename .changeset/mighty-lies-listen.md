---
'penpot-exporter': patch
---

Replaces O(n) linear searches with O(1) Map lookups for font family resolution. Pre-builds Maps at
module load instead of searching through 1,832+ fonts per text segment.
