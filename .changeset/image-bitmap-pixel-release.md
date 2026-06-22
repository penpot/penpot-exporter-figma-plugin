---
'penpot-exporter': patch
---

Lower peak memory during export by decoding images with createImageBitmap and releasing the decoded pixels deterministically once each image is re-encoded.
