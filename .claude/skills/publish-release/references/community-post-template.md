# Community announcement template

Post target: a **reply** in the existing Penpot community thread
<https://community.penpot.app/t/figma-to-penpot-export-plugin/5554> (do NOT open a new topic).

This is **not** the raw changelog — translate the changesets entries into user benefits. Map
**Minor changes → Highlights** (lead with these), and fold the user-visible **Patch changes** into
the relevant Highlight bullet or into "What to expect?". Skip purely internal patches.

## Formatting conventions (verified against the rendered 0.24.0 post)

- Written for **Discourse**: use `:emoji:` shortcodes (e.g. `:tada:`), never literal emoji.
- **Title line is bold**, prefixed with `:tada:`, em-dash glued to the version (no space before it,
  space after): `:tada: **Penpot Exporter X.Y.Z— <Hook>!**`
- **Greeting:** `Hey everyone :waving_hand:`
- In the intro, bold the product name inline: `**Penpot Exporter X.Y.Z**`.
- **Highlights header is bold:** `:rocket: **Highlights**`
- **Each highlight is a markdown bullet** (`*`) with an emoji and a **bold** feature name ending in
  a colon: `* :emoji: **Feature name:** description.` Pick a fitting emoji per feature (palette below).
- Use inline code for API/identifier names, e.g. `` `createImageBitmap` ``.
- **Section labels are bold:** `:stopwatch: **What to expect?**` and
  `:speech_balloon: **We'd love your feedback!**`
- **Closing link:** end with a bare URL — Discourse oneboxes it as "GitHub · Where software is built":
  `https://github.com/penpot/penpot-exporter-figma-plugin/issues`

Per-feature emoji palette (reuse what fits the feature):
`:milky_way:` `:high_voltage:` `:hammer_and_wrench:` `:triangular_ruler:` `:bar_chart:`
`:puzzle_piece:` `:film_projector:` `:dart:` `:sparkles:`

## Fill these placeholders

- `{{VERSION}}` — e.g. `0.25.0`
- `{{HOOK}}` — short benefit headline, e.g. `FigJam Support and Major Performance Optimizations`
- `{{INTRO}}` — 1–3 sentences of context
- `{{HIGHLIGHTS}}` — one bullet per headline feature (the Minor changes)
- `{{EXPECT}}` — one sentence/paragraph summarising the payoff

## Template

```
:tada: **Penpot Exporter {{VERSION}}— {{HOOK}}!**

Hey everyone :waving_hand:

{{INTRO}}

:rocket: **Highlights**

{{HIGHLIGHTS}}
<!-- each on its own line: * :emoji: **Feature name:** what it does for the user. -->

:stopwatch: **What to expect?** {{EXPECT}}

:speech_balloon: **We'd love your feedback!** Give these improvements a try and let us know how they work for your team. If you encounter any issues, please report them here: https://github.com/penpot/penpot-exporter-figma-plugin/issues
```

## Gold reference (the real, rendered 0.24.0 post — copy its shape exactly)

```
:tada: **Penpot Exporter 0.24.0— FigJam Support and Major Performance Optimizations!**

Hey everyone :waving_hand:

We're back with a brand new update that opens up completely new workflows and introduces important stability tweaks under the hood. The **Penpot Exporter 0.24.0** is here to make your migrations smoother and more reliable!

:rocket: **Highlights**

* :milky_way: **FigJam Files Support:** This release introduces an exciting new feature: support for FigJam files! You can now export your stickies and connectors directly into editable Penpot shapes, preserving your brainstorming sessions.

* :high_voltage: **Faster Image Exports:** We've optimized exports for image-heavy files. By fetching image bytes from Figma using a small concurrency pool instead of one at a time, your project exports should now be noticeably faster.

* :hammer_and_wrench: **Better Memory Management:** Large, image-heavy files were causing some export crashes due to high memory usage. To mitigate this, we've lowered peak memory during the process by decoding images with `createImageBitmap` (releasing pixels deterministically) and buffering the output zip as Blobs instead of keeping it all on the JS heap. We also fixed a specific crash on grids with non-finite numeric values (like those from deleted variables).

:stopwatch: **What to expect?** A brand new capability to bring your FigJam boards over to Penpot, along with a more robust and efficient experience when handling larger files.

:speech_balloon: **We'd love your feedback!** Try exporting your FigJam files and heavy projects, and let us know how these performance tweaks work for your team. If you encounter any issues or edge cases, please report them here so we can keep polishing the plugin: https://github.com/penpot/penpot-exporter-figma-plugin/issues
```

> If a more exact Gemini-gem template appears, paste it over this file — the placeholders, the
> formatting conventions, and the thread URL are what the skill relies on.
