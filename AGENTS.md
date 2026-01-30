# AGENTS

This file provides guidance for AI agents working in this repository.

## Project overview

**Penpot Exporter** is a Figma plugin that converts Figma files into `.zip` packages importable by
[Penpot](https://penpot.app/). The plugin traverses Figma's node tree, transforms each node into
Penpot's data model, and generates an exportable archive using the `@penpot/library` package.

## Quick start

```bash
npm install
npm run build          # or npm run build:watch for dev
```

In Figma: `Plugins` → `Development` → `Import plugin from manifest…` → select `manifest.json`

## Repository layout

```text
plugin-src/           # Figma plugin runtime (esbuild → dist/code.js)
├── code.ts           # Entry point - handles UI messages
├── handleMessage.ts  # Export orchestration
├── processors/       # High-level processing (pages, assets, styles, tokens)
├── transformers/     # Convert Figma nodes → Penpot shapes
│   └── partials/     # Reusable transformation helpers
├── translators/      # Convert specific values (fills, strokes, fonts, etc.)
├── libraries.ts      # Global state maps (components, images, styles)
└── utils/            # Math, color, progress utilities

ui-src/               # Plugin UI (Vite + Preact)
├── lib/types/        # Penpot type definitions (critical for data model)
│   └── shapes/       # Shape types: frame, text, path, etc.
├── parser/           # Parse Penpot document for import
└── components/       # UI components

common/               # Shared utilities (plugin + tests)
tests/                # Vitest tests mirroring plugin-src structure
dist/                 # Build output (generated)
```

## Architecture: Data flow

The export process follows this pipeline:

```text
Figma Node → Processor → Transformer → Translator → Penpot Shape
```

### 1. Processors (`plugin-src/processors/`)

Orchestrate high-level operations. They iterate over collections and delegate to transformers.

```typescript
// Example: processPages.ts
for (const page of pagesToProcess) {
  children.push(await transformPageNode(page));
}
```

### 2. Transformers (`plugin-src/transformers/`)

Convert a single Figma node into a Penpot shape. They compose multiple partial transformers.

```typescript
// Example: transformFrameNode.ts
return {
  type: 'frame',
  name: node.name,
  ...transformIds(node),
  ...transformFills(node),
  ...transformStrokes(node),
  ...(await transformChildren(node)),
};
```

**Pattern:** Transformers return a shape object by spreading results from partial functions.

### 3. Translators (`plugin-src/translators/`)

Convert specific Figma values to Penpot equivalents. Pure functions, no side effects.

```typescript
// Example: translateSolidFill.ts
export const translateSolidFill = (fill: SolidPaint): Fill => ({
  fillColor: rgbToHex(fill.color),
  fillOpacity: !fill.visible ? 0 : fill.opacity
});
```

**Pattern:** Translators are small, focused, and easily testable.

## Key files to understand

| File | Purpose |
| --- | --- |
| `plugin-src/code.ts` | Plugin entry point, message handling |
| `plugin-src/handleMessage.ts` | Export orchestration |
| `plugin-src/libraries.ts` | Global state (components, images, fonts) |
| `ui-src/lib/types/shapes/*.ts` | Penpot shape type definitions |
| `DEV_GUIDE.md` | Penpot data model & Clojure spec syntax |

## Common commands

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run build` | Dev build (plugin + UI) |
| `npm run build:prod` | Production build |
| `npm run build:watch` | Watch mode for development |
| `npm run lint` | Run all linters |
| `npm run fix-lint` | Auto-fix lint issues |
| `npm run lint:tsc-ui` | Type-check UI code |
| `npm run lint:tsc-plugin` | Type-check plugin code |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

## Code conventions

### TypeScript rules (enforced by ESLint)

- **Explicit return types required:** All functions must declare return types
- **Consistent type imports:** Use `import type { X }` for type-only imports
- **No unused variables:** Prefix with `_` if intentionally unused
- **No console.log:** Only `console.warn` and `console.error` allowed

```typescript
// Good
import type { FrameShape } from '@ui/lib/types/shapes/frameShape';

export const transformNode = (node: FrameNode): FrameShape => { ... };

// Bad
import { FrameShape } from '@ui/lib/types/shapes/frameShape'; // Missing 'type'
export const transformNode = (node: FrameNode) => { ... };   // Missing return type
```

### Path aliases

The project uses path aliases configured in `tsconfig.json`:

- `@plugin/*` → `plugin-src/*`
- `@ui/*` → `ui-src/*`
- `@common/*` → `common/*`

### Formatting

- Prettier with sorted imports (`@trivago/prettier-plugin-sort-imports`)
- Run `npm run fix-lint` before committing

## Testing

Tests live in `tests/` mirroring the `plugin-src/` structure.

### Writing tests

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Figma global when needed
const mockFigma = {
  variables: {
    getVariableByIdAsync: vi.fn()
  }
};
// @ts-expect-error - Mocking global figma object
global.figma = mockFigma;

describe('functionName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

### Test patterns

- Mock `figma` global for API calls
- Use `vi.fn()` for spies and mocks
- Clear mocks in `beforeEach`
- Test file naming: `*.test.ts`

## Changesets (for releases)

This project uses [changesets](https://github.com/changesets/changesets) for versioning.

### Creating a changeset

```bash
npx changeset
```

Select the change type:

- **patch:** Bug fixes, minor improvements
- **minor:** New features (backward compatible)
- **major:** Breaking changes

Write a concise description of the change. The changeset file goes in `.changeset/`.

### When to create changesets

Create a changeset for any PR that:

- Fixes a bug
- Adds a feature
- Changes behavior
- Updates dependencies significantly

## Penpot data model

The plugin converts Figma nodes to Penpot shapes. Key type definitions:

- **Shapes:** `ui-src/lib/types/shapes/` (frame, text, path, rect, circle, etc.)
- **Utils:** `ui-src/lib/types/utils/` (fill, stroke, color, shadow, etc.)

See `DEV_GUIDE.md` for Clojure spec syntax used in Penpot's type definitions.

## Common patterns

### Adding support for a new Figma property

1. **Find the Penpot equivalent** in `ui-src/lib/types/`
2. **Create/update translator** in `plugin-src/translators/`
3. **Update transformer** to call the translator
4. **Add tests** in `tests/plugin-src/`

### Adding a new node type transformer

1. Create `transformXxxNode.ts` in `plugin-src/transformers/`
2. Export from `plugin-src/transformers/index.ts`
3. Add case in parent transformer (usually `transformChildren.ts`)
4. Define shape type in `ui-src/lib/types/shapes/` if needed

### Working with global state

`plugin-src/libraries.ts` contains Maps for caching:

- `components` - Component definitions
- `images` - Image hashes
- `paintStyles` - Color styles
- `textStyles` - Typography styles
- `variables` - Design tokens

Always clear state between exports (handled by `clearAllState()`).

## Tips for agents

1. **Read types first:** Before modifying transformers, understand the Penpot shape types
2. **Follow the pipeline:** Processor → Transformer → Translator
3. **Small translators:** Keep translators focused on single conversions
4. **Type safety:** Always add explicit return types
5. **Run lint:** After changes, run `npm run lint` to catch issues
6. **Check existing patterns:** Look at similar transformers before creating new ones
7. **Mock Figma API:** Tests need to mock `global.figma` for API calls

## References

- [README.md](README.md) - User-facing documentation
- [DEV_GUIDE.md](DEV_GUIDE.md) - Penpot data model details
- [Penpot common types](https://github.com/penpot/penpot/tree/develop/common/src/app/common/types)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
