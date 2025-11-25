# LLM Quick Reference: Figma → Penpot

**Lookup tables and code snippets for quick reference during migration.**

> For detailed explanations, see `LLM_MIGRATION_GUIDE.md`

---

## MCP Tools

| Figma MCP                     | Returns                                        |
| ----------------------------- | ---------------------------------------------- |
| `get_design_context(nodeId?)` | React/Tailwind code (or XML for large designs) |
| `get_metadata(nodeId?)`       | XML: id, name, x, y, width, height             |
| `get_variable_defs(nodeId?)`  | Design tokens object                           |
| `get_screenshot(nodeId?)`     | Image                                          |

| Penpot MCP           | Description                                    |
| -------------------- | ---------------------------------------------- |
| `execute_code(code)` | Run JS with `penpot`, `penpotUtils`, `storage` |

---

## Node Type Mappings

| Figma                      | Penpot    | Method                               |
| -------------------------- | --------- | ------------------------------------ |
| `RECTANGLE`                | Rectangle | `penpot.createRectangle()`           |
| `ELLIPSE`                  | Ellipse   | `penpot.createEllipse()`             |
| `TEXT`                     | Text      | `penpot.createText(text)`            |
| `VECTOR/LINE/STAR/POLYGON` | Path      | `penpot.createPath()`                |
| `BOOLEAN_OPERATION`        | Boolean   | `penpot.createBoolean(type, shapes)` |
| `FRAME/SECTION`            | Board     | `penpot.createBoard()`               |
| `GROUP`                    | Group     | `penpot.group(shapes)`               |
| `COMPONENT`                | Component | Board + mark as component            |
| `INSTANCE`                 | Instance  | Link via `componentRefShape`         |

---

## Blend Modes

| Figma       | Penpot      |
| ----------- | ----------- |
| NORMAL      | normal      |
| MULTIPLY    | multiply    |
| SCREEN      | screen      |
| OVERLAY     | overlay     |
| DARKEN      | darken      |
| LIGHTEN     | lighten     |
| COLOR_DODGE | color-dodge |
| COLOR_BURN  | color-burn  |
| HARD_LIGHT  | hard-light  |
| SOFT_LIGHT  | soft-light  |
| DIFFERENCE  | difference  |
| EXCLUSION   | exclusion   |
| HUE         | hue         |
| SATURATION  | saturation  |
| COLOR       | color       |
| LUMINOSITY  | luminosity  |

---

## Boolean Operations

| Figma     | Penpot       |
| --------- | ------------ |
| UNION     | union        |
| INTERSECT | intersection |
| SUBTRACT  | difference   |
| EXCLUDE   | exclude      |

---

## Constraints

| Figma (H) | Penpot    | Figma (V) | Penpot    |
| --------- | --------- | --------- | --------- |
| MIN       | left      | MIN       | top       |
| CENTER    | center    | CENTER    | center    |
| MAX       | right     | MAX       | bottom    |
| STRETCH   | leftright | STRETCH   | topbottom |
| SCALE     | scale     | SCALE     | scale     |

---

## FlexLayout (Auto Layout)

| Figma                        | Penpot Property                       |
| ---------------------------- | ------------------------------------- |
| HORIZONTAL                   | `flex.dir = "row"`                    |
| VERTICAL                     | `flex.dir = "column"`                 |
| itemSpacing                  | `rowGap` (column) / `columnGap` (row) |
| paddingTop/Right/Bottom/Left | `topPadding`, `rightPadding`, etc.    |

| Figma Alignment | Penpot `justifyContent` |
| --------------- | ----------------------- |
| MIN             | start                   |
| CENTER          | center                  |
| MAX             | end                     |
| SPACE_BETWEEN   | space-between           |

| Figma Alignment | Penpot `alignItems` |
| --------------- | ------------------- |
| MIN             | start               |
| CENTER          | center              |
| MAX             | end                 |
| STRETCH         | stretch             |

---

## Text

| Figma               | Penpot                | Notes                          |
| ------------------- | --------------------- | ------------------------------ |
| characters          | `text.characters`     | Not `content`                  |
| textAlignHorizontal | `text.align`          | left/center/right/justify      |
| textAlignVertical   | `text.verticalAlign`  | top/center/bottom              |
| textDecoration      | `text.textDecoration` | underline/line-through         |
| textCase            | `text.textTransform`  | uppercase/lowercase/capitalize |

**lineHeight**: Use relative multipliers as strings (`"1"`, `"1.2"`, `"1.5"`)

---

## Stroke Alignment

| Figma   | Penpot |
| ------- | ------ |
| CENTER  | center |
| INSIDE  | inner  |
| OUTSIDE | outer  |

---

## Code Snippets

### Rectangle

```javascript
const rect = penpot.createRectangle();
rect.name = 'Rectangle';
rect.resize(200, 100);
rect.fills = [{ fillColor: '#ff0000' }];
rect.borderRadius = 8;
parent.appendChild(rect);
```

### Board with FlexLayout

```javascript
const board = penpot.createBoard();
board.resize(400, 300);
const flex = board.addFlexLayout();
flex.dir = 'column';
flex.rowGap = 16;
flex.topPadding = 24;
flex.leftPadding = 24;
// Add children at x=0, y=0
```

### Text

```javascript
const text = penpot.createText('Hello');
text.characters = 'Hello';
text.resize(100, 24);
text.growType = 'fixed';
text.fontFamily = 'sourcesanspro';
text.fontSize = '16';
text.lineHeight = '1.2';
text.x = 0;
text.y = 0;
```

### GridLayout

```javascript
const board = penpot.createBoard();
const grid = board.addGridLayout();
grid.addColumn('fixed', 200);
grid.addColumn('flex', 1);
grid.addRow('auto', 0);
grid.appendChild(child, 0, 0); // row, col
```

### Path (SVG String)

```javascript
const path = penpot.createPath();
path.content = 'M 0 0 L 100 50 C 120 50, 150 80, 180 60';
path.strokes = [{ strokeColor: '#171717', strokeWidth: 2, strokeAlignment: 'center' }];
path.x = 100; // Set AFTER content!
path.y = 200;
```

### Card

```javascript
const card = penpot.createBoard();
card.resize(372, 243);
card.borderRadius = 14;
card.fills = [{ fillColor: '#ffffff' }];
card.strokes = [{ strokeColor: '#e5e5e5', strokeWidth: 1, strokeAlignment: 'inner' }];
```

### Ellipse (Avatar)

```javascript
const avatar = penpot.createEllipse();
avatar.resize(32, 32);
avatar.fills = [{ fillColor: '#e5e5e5' }];
```

---

## Common Gotchas

1. `resize(w, h)` not `width`/`height`
2. `flex.dir` not `direction`
3. `rowGap`/`columnGap` not `gap`
4. `text.characters` not `content`
5. `grid.appendChild(child, row, col)` not `board.appendChild`
6. `grid.addColumn()`/`addRow()` not `columns`/`rows`
7. Add FlexLayout BEFORE children
8. Children at `x=0, y=0` in FlexLayout
9. Set path `x`/`y` AFTER `content`
10. lineHeight: `"1.2"` not `"16"`
11. Hex colors: `"#ffffff"` works directly
12. borderRadius works on boards
13. Font fallback: `sourcesanspro`
14. Large designs: query sub-nodes
15. Shapes created at root by default - always `appendChild()` to parent
16. Verify parent exists before `appendChild()` - fails silently if undefined

---

## Font Fallbacks

```javascript
const FONTS = {
  Geist: 'sourcesanspro',
  Inter: 'sourcesanspro',
  default: 'sourcesanspro'
};
```

---

## Storage Pattern

```javascript
if (!storage.migrationState) {
  storage.migrationState = {
    idMapping: {},
    errors: [],
    warnings: []
  };
}
storage.migrationState.idMapping[figmaId] = penpotId;
```

---

## Find Shapes

```javascript
penpotUtils.findShapeById(id);
penpotUtils.findShapes(s => s.type === 'rectangle');
penpotUtils.shapeStructure(shape, depth);
```
