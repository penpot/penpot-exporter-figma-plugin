# LLM Migration Guide: Figma → Penpot via MCP

**The single comprehensive guide for migrating Figma designs to Penpot.**

> This document consolidates all learnings from real migrations, including a 185-element dashboard.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [MCP Tools Reference](#2-mcp-tools-reference)
3. [Node Type Mappings](#3-node-type-mappings)
4. [Step-by-Step Workflow](#4-step-by-step-workflow)
5. [Critical API Patterns](#5-critical-api-patterns)
6. [Text Handling](#6-text-handling)
7. [Layout Systems](#7-layout-systems)
8. [Paths & Charts](#8-paths--charts)
9. [Tables](#9-tables)
10. [Components & Instances](#10-components--instances)
11. [Common Gotchas](#11-common-gotchas)
12. [Code Examples](#12-code-examples)
13. [Error Handling](#13-error-handling)
14. [Real-World Example](#14-real-world-example)
15. [Known Gaps](#15-known-gaps-not-yet-documented)

---

## 1. Quick Start

### Migration State Initialization

```javascript
if (!storage.migrationState) {
  storage.migrationState = {
    idMapping: {}, // Figma ID → Penpot ID
    createdComponents: {}, // Component registry
    createdStyles: {}, // Style registry
    errors: [],
    warnings: []
  };
}
```

### Basic Shape Creation Pattern

```javascript
const rect = penpot.createRectangle();
rect.name = 'My Rectangle';
rect.x = 100;
rect.y = 100;
rect.resize(200, 100); // ✅ Use resize() - width/height are read-only
rect.fills = [{ fillColor: '#ff0000' }]; // ✅ Hex strings work directly
rect.borderRadius = 8; // ✅ Works directly on rectangles/boards
penpot.root.appendChild(rect);
```

---

## 2. MCP Tools Reference

### Figma MCP

⚠️ **Important**: Figma MCP returns **React/Tailwind code**, not raw design data.

| Tool                          | Returns                             | Use For                    |
| ----------------------------- | ----------------------------------- | -------------------------- |
| `get_design_context(nodeId?)` | React/Tailwind code                 | Extract styling, structure |
| `get_metadata(nodeId?)`       | XML (id, name, x, y, width, height) | Basic properties           |
| `get_variable_defs(nodeId?)`  | Object                              | Design tokens              |
| `get_screenshot(nodeId?)`     | Image                               | Visual reference           |

#### Large Design Behavior

**For large designs**, `get_design_context()` returns XML metadata instead of code:

```
IMPORTANT: The design was too large to fit into context...
```

**Solution**: Call `get_design_context(nodeId)` on specific sub-nodes:

```javascript
// 1. Root call returns XML with node IDs
const root = await figmaMCP.get_design_context(); // → XML metadata

// 2. Query specific sub-nodes for React/Tailwind code
const column = await figmaMCP.get_design_context('2:4241'); // → React code
```

### Penpot MCP

| Tool                 | Description                  |
| -------------------- | ---------------------------- |
| `execute_code(code)` | Execute JavaScript in Penpot |

**Available Objects**:

- `penpot` - Main API (createRectangle, createBoard, createText, etc.)
- `penpotUtils` - Helpers (findShapeById, findShapes, shapeStructure)
- `storage` - Persistent state storage

---

## 3. Node Type Mappings

### Shape Types

| Figma Type          | Penpot Type        | Creation Method                      |
| ------------------- | ------------------ | ------------------------------------ |
| `RECTANGLE`         | `Rectangle`        | `penpot.createRectangle()`           |
| `ELLIPSE`           | `Ellipse`          | `penpot.createEllipse()`             |
| `TEXT`              | `Text`             | `penpot.createText(text)`            |
| `VECTOR`            | `Path`             | `penpot.createPath()`                |
| `LINE`              | `Path`             | `penpot.createPath()`                |
| `STAR`              | `Path`             | `penpot.createPath()`                |
| `POLYGON`           | `Path`             | `penpot.createPath()`                |
| `BOOLEAN_OPERATION` | `Boolean`          | `penpot.createBoolean(type, shapes)` |
| `FRAME`             | `Board`            | `penpot.createBoard()`               |
| `SECTION`           | `Board`            | `penpot.createBoard()`               |
| `GROUP`             | `Group`            | `penpot.group(shapes)`               |
| `COMPONENT`         | `Component`        | Create as Board, mark as component   |
| `INSTANCE`          | Component Instance | Link via `componentRefShape`         |

### Blend Modes

| Figma         | Penpot        |
| ------------- | ------------- |
| `NORMAL`      | `normal`      |
| `MULTIPLY`    | `multiply`    |
| `SCREEN`      | `screen`      |
| `OVERLAY`     | `overlay`     |
| `DARKEN`      | `darken`      |
| `LIGHTEN`     | `lighten`     |
| `COLOR_DODGE` | `color-dodge` |
| `COLOR_BURN`  | `color-burn`  |
| `HARD_LIGHT`  | `hard-light`  |
| `SOFT_LIGHT`  | `soft-light`  |
| `DIFFERENCE`  | `difference`  |
| `EXCLUSION`   | `exclusion`   |
| `HUE`         | `hue`         |
| `SATURATION`  | `saturation`  |
| `COLOR`       | `color`       |
| `LUMINOSITY`  | `luminosity`  |

### Boolean Operations

| Figma       | Penpot         |
| ----------- | -------------- |
| `UNION`     | `union`        |
| `INTERSECT` | `intersection` |
| `SUBTRACT`  | `difference`   |
| `EXCLUDE`   | `exclude`      |

### Constraints

| Figma (H) | Penpot      | Figma (V) | Penpot      |
| --------- | ----------- | --------- | ----------- |
| `MIN`     | `left`      | `MIN`     | `top`       |
| `CENTER`  | `center`    | `CENTER`  | `center`    |
| `MAX`     | `right`     | `MAX`     | `bottom`    |
| `STRETCH` | `leftright` | `STRETCH` | `topbottom` |
| `SCALE`   | `scale`     | `SCALE`   | `scale`     |

---

## 4. Step-by-Step Workflow

### Phase 1: Preparation

```javascript
// Step 1: Initialize state
if (!storage.migrationState) {
  storage.migrationState = {
    idMapping: {},
    createdComponents: {},
    createdStyles: {},
    errors: [],
    warnings: []
  };
}

// Step 2: Extract Figma structure
const metadata = await figmaMCP.get_metadata(rootNodeId);
const designCode = await figmaMCP.get_design_context(rootNodeId);

// Step 3: Parse and build dependency graph
const nodeIds = extractNodeIds(designCode);
```

### Phase 2: Foundation Creation

```javascript
// Step 4: Create design tokens (if any)
// Step 5: Create styles
// Step 6: Create components (before instances)
```

### Phase 3: Structure Creation

```javascript
// Step 7: Create root frame/board
const rootFrame = penpot.createBoard();
rootFrame.name = 'Root';
rootFrame.resize(metadata.width, metadata.height);
penpot.root.appendChild(rootFrame);

// Step 8: Create layout containers (GridLayout or FlexLayout)
// Step 9: Create shapes recursively
// Step 10: Create component instances
```

### Phase 4: Validation

```javascript
// Step 11: Validate migration
const validation = {
  totalNodes: Object.keys(storage.migrationState.idMapping).length,
  errors: storage.migrationState.errors,
  warnings: storage.migrationState.warnings
};
```

### Dependency Order

Always create in this order:

1. **Tokens** (no dependencies)
2. **Styles** (depend on tokens)
3. **Components** (depend on styles)
4. **Pages & Boards** (depend on components)
5. **Shapes & Instances** (depend on everything above)

---

## 5. Critical API Patterns

### ⚠️ Width/Height are Read-Only

```javascript
// ❌ WRONG - Will throw error
rect.width = 200;
rect.height = 100;

// ✅ CORRECT
rect.resize(200, 100);
```

### ⚠️ Hex Colors Work Directly

```javascript
// ✅ SIMPLER (recommended)
fills: [{ fillColor: '#ffffff' }];
strokes: [{ strokeColor: '#e5e5e5', strokeWidth: 1, strokeAlignment: 'inner' }];

// Also works: RGB objects
fills: [{ fillColor: { r: 1, g: 1, b: 1, a: 1 } }];
```

### ⚠️ borderRadius Works Directly

```javascript
const card = penpot.createBoard();
card.borderRadius = 14; // ✅ Works on boards and rectangles
```

### ⚠️ Font Fallbacks

Figma fonts may not exist in Penpot. Use fallbacks:

```javascript
const FONT_FALLBACKS = {
  'Geist': 'sourcesanspro',
  'Inter': 'sourcesanspro',
  'SF Pro': 'sourcesanspro',
  'default': 'sourcesanspro'
};

text.fontFamily = FONT_FALLBACKS[figmaFont] || FONT_FALLBACKS['default'];
```

### ⚠️ Shapes Created at Root by Default

**CRITICAL**: All `penpot.create*()` methods add shapes to the **root page** by default. You MUST
explicitly append them to the correct parent.

```javascript
// ❌ DANGEROUS - shape ends up at root if parent lookup fails
const child = penpot.createRectangle();
const parent = penpotUtils.findShapeById(someId); // Could return undefined!
parent.appendChild(child); // TypeError if parent is undefined, shape stays at root

// ✅ SAFE - verify parent exists first
const child = penpot.createRectangle();
const parent = penpotUtils.findShapeById(someId);
if (parent) {
  parent.appendChild(child);
} else {
  storage.migrationState.errors.push({ nodeId: someId, error: 'Parent not found' });
  child.remove(); // Clean up orphaned shape
}
```

**Why this matters**: If `appendChild()` fails silently (e.g., parent is `undefined`), shapes remain
orphaned at the root level, causing visual clutter and broken hierarchy.

### ⚠️ Store Parent References, Don't Re-lookup

When creating deeply nested structures, store parent references in variables rather than looking
them up repeatedly:

```javascript
// ❌ RISKY - repeated lookups can fail mid-migration
const card = penpot.createBoard();
storage.migrationState.idMapping['card1'] = card.id;
parent.appendChild(card);

// Later...
const cardRef = penpotUtils.findShapeById(storage.migrationState.idMapping['card1']);
cardRef.appendChild(child); // Could fail if ID mapping is stale

// ✅ SAFER - keep reference in variable for immediate use
const card = penpot.createBoard();
storage.migrationState.idMapping['card1'] = card.id;
parent.appendChild(card);

// Use card directly while in scope
const child = penpot.createText('Title');
card.appendChild(child); // Direct reference, guaranteed to work
```

---

## 6. Text Handling

### Complete Text Creation Pattern

```javascript
const text = penpot.createText('Hello World');
text.name = 'My Text';
text.characters = 'Hello World'; // ✅ Use 'characters', not 'content'

// Dimensions from metadata
text.resize(metadata.width, metadata.height);
text.growType = 'fixed'; // ✅ Use "fixed" with explicit dimensions

// Position (for FlexLayout children, use 0,0)
text.x = 0;
text.y = 0;

// Typography
text.fontFamily = 'sourcesanspro';
text.fontSize = '16'; // ✅ String
text.fontWeight = '400'; // ✅ String
text.lineHeight = '1.2'; // ✅ Relative multiplier as string
text.letterSpacing = '0';
text.verticalAlign = 'top'; // Aligns text to top of bounding box

// Fills
text.fills = [{ fillColor: '#000000' }];
```

### ⚠️ lineHeight: Use Relative Multipliers

**Source of Truth**: Plugin code (`translateLineHeight.ts`)

The plugin converts Figma lineHeight to **relative multipliers**:

- **PIXELS**: `(value / fontSize)` → `"1"` for 16px/16px, `"1.5"` for 24px/16px
- **PERCENT**: `(value / 100)` → `"1.2"` for 120%
- **AUTO**: `"1.2"` (default)

```javascript
// ✅ CORRECT - Penpot expects relative multipliers as strings
text.lineHeight = '1'; // 1x fontSize
text.lineHeight = '1.2'; // 1.2x fontSize
text.lineHeight = '1.5'; // 1.5x fontSize

// ❌ WRONG - Don't use absolute pixels
text.lineHeight = '16'; // Wrong!
text.lineHeight = '24'; // Wrong!
```

### Text in FlexLayout

```javascript
// For text elements inside FlexLayout containers:
text.x = 0; // ✅ Relative to FlexLayout parent
text.y = 0; // ✅ FlexLayout handles positioning
```

---

## 7. Layout Systems

### FlexLayout (Auto Layout)

**⚠️ CRITICAL**: Add FlexLayout BEFORE adding children!

```javascript
// 1. Create container
const container = penpot.createBoard();
container.resize(400, 300);

// 2. Add FlexLayout FIRST
const flex = container.addFlexLayout();
flex.dir = 'column'; // ✅ Use 'dir', not 'direction'
flex.rowGap = 16; // ✅ Use rowGap for column direction
flex.columnGap = 0; // ✅ Use columnGap for row direction
flex.alignItems = 'start';
flex.justifyContent = 'start';

// Padding
flex.topPadding = 24;
flex.rightPadding = 24;
flex.bottomPadding = 24;
flex.leftPadding = 24;

// 3. Add children with relative positions (0,0)
const child = penpot.createBoard();
child.x = 0; // ✅ Relative to FlexLayout parent
child.y = 0; // ✅ FlexLayout handles positioning
container.appendChild(child);
```

### FlexLayout Direction & Gap

```javascript
// Column direction (vertical stacking)
flex.dir = 'column';
flex.rowGap = 16; // Spacing between items
flex.columnGap = 0;

// Row direction (horizontal)
flex.dir = 'row';
flex.rowGap = 0;
flex.columnGap = 16; // Spacing between items
```

### FlexLayout Alignment

| Figma           | Penpot `justifyContent` |
| --------------- | ----------------------- |
| `MIN`           | `start`                 |
| `CENTER`        | `center`                |
| `MAX`           | `end`                   |
| `SPACE_BETWEEN` | `space-between`         |

| Figma     | Penpot `alignItems` |
| --------- | ------------------- |
| `MIN`     | `start`             |
| `CENTER`  | `center`            |
| `MAX`     | `end`               |
| `STRETCH` | `stretch`           |

### GridLayout

```javascript
const board = penpot.createBoard();
board.resize(800, 600);

// Add GridLayout
const grid = board.addGridLayout(); // Returns GridLayout object
grid.columnGap = 32;
grid.rowGap = 16;

// Add columns (columns property is read-only!)
grid.addColumn('fixed', 200); // ✅ Use addColumn()
grid.addColumn('fixed', 300);
grid.addColumn('flex', 1); // Flexible column

// Add rows
grid.addRow('fixed', 100); // ✅ Use addRow()
grid.addRow('auto', 0); // Auto-sized row

// Add children (MUST use grid.appendChild, not board.appendChild!)
const child = penpot.createBoard();
child.resize(200, 100);
grid.appendChild(child, 0, 0); // ✅ row 0, column 0
```

### ⚠️ Layout Positioning Rules

1. **Add FlexLayout/GridLayout BEFORE children**
2. **All children at `x=0, y=0`** relative to layout parent
3. **Padding on container**, not children
4. **Spacing via `rowGap`/`columnGap`**, not manual positioning

---

## 8. Paths & Charts

### ✅ SVG Path Strings Work

The Penpot Plugin API accepts SVG path strings:

```javascript
const path = penpot.createPath();
path.content = 'M 0 32 C 30 32, 30 4, 60 4 C 90 4, 90 20, 120 20'; // ✅ SVG string
path.strokes = [{ strokeColor: '#171717', strokeWidth: 2, strokeAlignment: 'center' }];
path.fills = [];

// ⚠️ CRITICAL: Set position AFTER content (position set before is ignored!)
path.x = 100;
path.y = 200;
```

### SVG Path Commands

```javascript
// M = moveto, L = lineto, C = curveto, Z = closepath
const svgPath = 'M 0 0 L 100 50 C 120 50, 150 80, 180 60 Z';
```

### Chart Line Pattern

```javascript
// Create smooth line chart with curves
const dataPoints = [
  { x: 0, y: 32 },
  { x: 60, y: 4 },
  { x: 120, y: 20 },
  { x: 180, y: 60 },
  { x: 240, y: 28 },
  { x: 300, y: 24 }
];

// Build SVG path with curves
let pathString = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
for (let i = 1; i < dataPoints.length; i++) {
  const prev = dataPoints[i - 1];
  const curr = dataPoints[i];
  const cpX = prev.x + (curr.x - prev.x) * 0.5;
  pathString += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
}

const chartPath = penpot.createPath();
chartPath.content = pathString;
chartPath.strokes = [{ strokeColor: '#171717', strokeWidth: 2, strokeAlignment: 'center' }];
chartPath.x = chartContainer.x; // Set AFTER content!
chartPath.y = chartContainer.y;
```

### Bar Charts

```javascript
const barHeights = [0.39, 0.88, 0.5, 0.66, 0.39];

barHeights.forEach((heightPercent, index) => {
  const bar = penpot.createRectangle();
  bar.resize(barWidth, chartHeight * heightPercent);
  bar.x = chartX + index * (barWidth + gap);
  bar.y = chartY + chartHeight - bar.height;
  bar.fills = [{ fillColor: '#171717' }];
  bar.borderRadius = 4; // Rounded top
  parent.appendChild(bar);
});
```

### Data Point Dots

```javascript
dataPoints.forEach((point, index) => {
  const dot = penpot.createEllipse();
  dot.resize(6, 6);
  dot.x = parent.x + point.x - 3;
  dot.y = parent.y + point.y - 3;
  dot.fills = [{ fillColor: '#171717' }];
  parent.appendChild(dot);
});
```

### Area Charts

```javascript
// Create path with fill for area
const areaPath = penpot.createPath();
areaPath.content = `M 0 100 L 0 ${firstY} ${curveCommands} L ${lastX} 100 Z`;
areaPath.fills = [{ fillColor: '#171717', fillOpacity: 0.1 }]; // Semi-transparent fill
areaPath.strokes = [];
```

---

## 9. Tables

### Adding Elements to Existing Table Rows

```javascript
// Elements appended to rows appear at END of row's child list
const tableRow = dataTable.children.find(c => c.name === 'Table Row');

const checkbox = penpot.createRectangle();
checkbox.resize(16, 16);
checkbox.fills = [{ fillColor: '#ffffff' }];
checkbox.strokes = [{ strokeColor: '#e5e5e5', strokeWidth: 1, strokeAlignment: 'inner' }];
checkbox.borderRadius = 4;
checkbox.x = tableRow.x + 8;
checkbox.y = tableRow.y + 18;
tableRow.appendChild(checkbox); // Appears at end of row
```

### Table Footer Pattern

```javascript
const footer = penpot.createBoard();
footer.name = 'Table Footer';
footer.resize(tableWidth, 32);
footer.x = table.x;
footer.y = table.y + table.height + 16;

const footerLayout = footer.addFlexLayout();
footerLayout.dir = 'row';
footerLayout.justifyContent = 'space-between';
footerLayout.alignItems = 'center';

// Selection text
const footerText = penpot.createText('0 of 5 row(s) selected.');
footerText.fontFamily = 'sourcesanspro';
footerText.fontSize = '14';
footerText.fills = [{ fillColor: '#737373' }];
footer.appendChild(footerText);
```

### ⚠️ Table Limitations

1. **appendChild order matters** - Children appear after existing ones
2. **No insertBefore/prepend** - Can't easily insert at beginning
3. **Flex layouts may override positions** - Children follow flex rules

---

## 10. Components & Instances

### Instance Internal Node IDs

Instances expose their complete internal structure via `get_design_context()`:

```
Instance ID: "2:4247"
Internal nodes: "I2:4247;521:1534"  (format: I{instanceId};{internalNodeId})
```

### Extracting Instance Internals

```javascript
function extractInstanceInternals(instanceCode) {
  const internals = [];
  const regex = /data-node-id="I([^;]+);([^"]+)"/g;
  let match;

  while ((match = regex.exec(instanceCode)) !== null) {
    internals.push({
      instanceId: match[1],
      internalNodeId: match[2],
      fullId: `I${match[1]};${match[2]}`
    });
  }
  return internals;
}
```

### Migration Strategies

**Strategy A: Component Reference** (when component exists)

```javascript
const instance = penpot.createRectangle();
instance.componentRefShape = componentId;
```

**Strategy B: Flatten Structure** (when component doesn't exist)

- Extract all internal nodes
- Transform each as regular shapes
- Loses component relationship

---

## 11. Common Gotchas

| #   | Issue                      | Solution                                          |
| --- | -------------------------- | ------------------------------------------------- |
| 1   | Width/Height are read-only | Use `resize(width, height)`                       |
| 2   | GridLayout appendChild     | Use `grid.appendChild(child, row, col)`           |
| 3   | GridLayout columns/rows    | Use `addColumn()`/`addRow()`                      |
| 4   | FlexLayout direction       | Use `dir`, not `direction`                        |
| 5   | FlexLayout gap             | Use `rowGap`/`columnGap`, not `gap`               |
| 6   | Text content               | Use `characters`, not `content`                   |
| 7   | Text in FlexLayout         | Set `x=0, y=0`                                    |
| 8   | Text dimensions            | Use `resize()` + `growType = "fixed"`             |
| 9   | lineHeight                 | Use relative multipliers ("1", "1.2")             |
| 10  | Boolean operations         | Require at least 2 children                       |
| 11  | Sections                   | Don't support strokes, blend modes, corner radius |
| 12  | Images                     | Use `fillImage` in Fill                           |
| 13  | Fonts                      | Use fallbacks (sourcesanspro)                     |
| 14  | Component Sets             | Create all variants first, then link              |
| 15  | Nested Layouts             | Create parent layout before children              |
| 16  | Hex Colors                 | Use `"#ffffff"` directly                          |
| 17  | borderRadius               | Works directly on boards                          |
| 18  | SVG Path Strings           | Use `path.content = "M 0 0 L 100 50"`             |
| 19  | Path Position              | Set `x`/`y` AFTER `content`                       |
| 20  | Table appendChild          | Children appear at END of flex layouts            |
| 21  | FlexLayout timing          | Add layout BEFORE adding children                 |
| 22  | Mixed values               | Handle per-segment for text fills                 |
| 23  | Large designs              | Call `get_design_context` on sub-nodes            |
| 24  | Orphaned shapes at root    | Always verify parent exists before appendChild    |
| 25  | Silent appendChild failure | Store parent refs in variables, not ID lookups    |

---

## 12. Code Examples

### Complete Card Pattern

```javascript
const card = penpot.createBoard();
card.name = 'Card';
card.resize(372, 243);
card.borderRadius = 14;
card.fills = [{ fillColor: '#ffffff' }];
card.strokes = [{ strokeColor: '#e5e5e5', strokeWidth: 1, strokeAlignment: 'inner' }];
card.x = 0;
card.y = 0;

const cardFlex = card.addFlexLayout();
cardFlex.dir = 'column';
cardFlex.rowGap = 16;
cardFlex.topPadding = 24;
cardFlex.rightPadding = 24;
cardFlex.bottomPadding = 24;
cardFlex.leftPadding = 24;

// Add title
const title = penpot.createText('Card Title');
title.characters = 'Card Title';
title.fontFamily = 'sourcesanspro';
title.fontSize = '18';
title.fontWeight = '600';
title.lineHeight = '1.2';
title.fills = [{ fillColor: '#0a0a0a' }];
title.resize(324, 24);
title.growType = 'fixed';
title.x = 0;
title.y = 0;
card.appendChild(title);

parent.appendChild(card);
```

### Complete Button Pattern

```javascript
const button = penpot.createBoard();
button.name = 'Button';
button.resize(120, 40);
button.borderRadius = 8;
button.fills = [{ fillColor: '#171717' }]; // Dark background

const buttonFlex = button.addFlexLayout();
buttonFlex.alignItems = 'center';
buttonFlex.justifyContent = 'center';

const buttonText = penpot.createText('Click me');
buttonText.characters = 'Click me';
buttonText.fontFamily = 'sourcesanspro';
buttonText.fontSize = '14';
buttonText.fontWeight = '500';
buttonText.fills = [{ fillColor: '#ffffff' }]; // White text
buttonText.growType = 'auto-width';
buttonText.x = 0;
buttonText.y = 0;
button.appendChild(buttonText);
```

### Input Field Pattern

```javascript
const input = penpot.createBoard();
input.name = 'Input';
input.resize(300, 40);
input.borderRadius = 8;
input.fills = [{ fillColor: '#ffffff' }];
input.strokes = [{ strokeColor: '#e5e5e5', strokeWidth: 1, strokeAlignment: 'inner' }];

const inputFlex = input.addFlexLayout();
inputFlex.alignItems = 'center';
inputFlex.leftPadding = 12;

const placeholder = penpot.createText('Enter text...');
placeholder.characters = 'Enter text...';
placeholder.fontFamily = 'sourcesanspro';
placeholder.fontSize = '14';
placeholder.fills = [{ fillColor: '#a3a3a3' }];
placeholder.x = 0;
placeholder.y = 0;
input.appendChild(placeholder);
```

### Avatar Pattern

```javascript
const avatar = penpot.createEllipse();
avatar.name = 'Avatar';
avatar.resize(32, 32);
avatar.fills = [{ fillColor: '#e5e5e5' }]; // Placeholder color
avatar.x = 0;
avatar.y = 0;
parent.appendChild(avatar);
```

---

## 13. Error Handling

### Error Recovery Pattern

```javascript
async function migrateWithRetry(figmaNode, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await migrateNode(figmaNode);
    } catch (error) {
      console.warn(`Attempt ${attempt} failed for ${figmaNode.id}: ${error.message}`);

      if (attempt === retries) {
        storage.migrationState.errors.push({
          nodeId: figmaNode.id,
          error: error.message
        });
        return null;
      }

      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

### Validation Checklist

Before creating in Penpot:

- [ ] All style references exist
- [ ] All component references exist
- [ ] Parent exists for child elements
- [ ] Required properties present
- [ ] Data types correct

### Post-Migration Validation

After migration, verify no orphaned shapes exist at root:

```javascript
// Check for orphaned elements
const root = penpot.root;
const expectedRootChildren = ['Light']; // Your main container name(s)

const orphaned = root.children.filter(c => !expectedRootChildren.includes(c.name));
if (orphaned.length > 0) {
  console.warn(
    'Orphaned elements found:',
    orphaned.map(e => ({ name: e.name, type: e.type }))
  );

  // Option 1: Remove orphans
  orphaned.forEach(e => e.remove());

  // Option 2: Log for manual review
  storage.migrationState.warnings.push({
    type: 'orphaned_elements',
    count: orphaned.length,
    elements: orphaned.map(e => e.name)
  });
}
```

### Debugging

```javascript
// Check migration state
console.log(JSON.stringify(storage.migrationState, null, 2));

// Find shape by ID
const shape = penpotUtils.findShapeById(penpotId);

// Get structure overview
const structure = penpotUtils.shapeStructure(penpot.root, 3);

// Count elements by type
const rectangles = penpotUtils.findShapes(s => s.type === 'rectangle');
const texts = penpotUtils.findShapes(s => s.type === 'text');
```

---

## 14. Real-World Example

### Dashboard Migration (185 Elements)

**What Was Migrated**:

- Root board "Light" (1504 × 1698px)
- 3-column GridLayout
- 10+ cards with FlexLayout
- 83 text elements
- 94 boards/frames
- 8 ellipses (avatars)
- 4 charts (line, bar, area, dual-line)
- Data table with pagination

**Statistics**:

| Metric        | Value |
| ------------- | ----- |
| Total Shapes  | 185   |
| Boards/Frames | 94    |
| Text Elements | 83    |
| ID Mappings   | 80    |
| Errors        | 0     |

**Key Patterns Used**:

1. **Large Design Chunking**:

```javascript
// Root returns XML → query sub-nodes
const columnIds = ['2:4241', '2:4416', '2:4302'];
for (const id of columnIds) {
  const code = await figmaMCP.get_design_context(id);
  // Process each column
}
```

2. **Hex Color Shorthand**:

```javascript
fills: [{ fillColor: '#ffffff' }];
strokes: [{ strokeColor: '#e5e5e5', strokeWidth: 1, strokeAlignment: 'inner' }];
```

3. **Font Fallback**:

```javascript
text.fontFamily = 'sourcesanspro'; // Instead of "Geist"
```

4. **SVG Path Strings for Charts**:

```javascript
path.content = 'M 0 32 C 30 32, 30 4, 60 4...';
path.x = 100; // Set AFTER content!
```

5. **Iterative Building**:

- Create structure incrementally
- Validate as you go
- Fix issues before proceeding

---

## 15. Known Gaps (Not Yet Documented)

Features that exist but lack documentation/examples:

| Feature                    | Status          | Workaround                 |
| -------------------------- | --------------- | -------------------------- |
| Gradients (linear, radial) | No examples     | Use solid colors           |
| Shadows/Effects            | Not documented  | Skip or use opacity        |
| Image fills                | Mentioned only  | Use placeholder rectangles |
| Boolean operations         | Mapping only    | Create shapes manually     |
| Masks/Clipping             | Not documented  | Skip                       |
| Groups                     | Mentioned only  | Use boards instead         |
| Component creation         | Partial         | Create as boards           |
| Component variants         | Not documented  | Create separate components |
| Design tokens              | Extraction only | Use direct values          |
| Paint/Text styles          | Not documented  | Apply properties directly  |
| Rotation                   | Mentioned only  | Set `rotation` property    |
| Constraints                | Mapping only    | Use layouts instead        |

**When you encounter these**: Use the workaround, don't spend time experimenting.

---

## Summary

**Remember these key rules**:

1. ✅ Use `resize()` for dimensions
2. ✅ Use `dir`, `rowGap`, `columnGap` for FlexLayout
3. ✅ Use `characters` for text content
4. ✅ Use hex strings for colors (`"#ffffff"`)
5. ✅ Add layout BEFORE children
6. ✅ Set children at `x=0, y=0` in FlexLayout
7. ✅ Set path position AFTER content
8. ✅ Use relative multipliers for lineHeight (`"1.2"`)
9. ✅ Use font fallbacks (`sourcesanspro`)
10. ✅ Query sub-nodes for large designs

---

_This guide consolidates all learnings from real Figma → Penpot migrations._
