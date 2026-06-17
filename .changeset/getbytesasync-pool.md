---
'penpot-exporter': patch
---

Speed up exports of image-heavy files by fetching image bytes from Figma with a small concurrency pool instead of one at a time.
