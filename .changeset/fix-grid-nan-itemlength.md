---
'penpot-exporter': patch
---

Fix export crash ("expected valid shape") when a grid references a deleted numeric variable. Figma renders the orphaned value as `0` but exposes it as `NaN`, which Penpot rejects. Non-finite numeric grid metrics are now sanitized via a reusable `finiteOrUndefined` helper.
