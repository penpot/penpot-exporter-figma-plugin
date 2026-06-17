---
'penpot-exporter': patch
---

Reduce memory usage during export by buffering the output zip as Blobs instead of keeping it on the JS heap.
