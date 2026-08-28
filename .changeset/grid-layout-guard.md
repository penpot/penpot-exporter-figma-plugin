---
'penpot-exporter': patch
---

Export grid frames with default track sizing (or as plain frames when even that fails) when Figma's Grid API errors, instead of aborting the whole export, and skip layers whose reads fail with the same Figma platform error signatures during large exports. Once the Figma platform failure is detected in an export, any subsequent per-layer error is contained and reported instead of aborting, including asset processing and progress messaging.
