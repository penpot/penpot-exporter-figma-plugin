# Figma MCP Data Format Documentation

This document describes the actual data format returned by the Figma MCP server, based on
inspection.

## Overview

**Important Discovery**: The Figma MCP returns **React/Tailwind code**, not raw design data. This is
different from what might be expected for a migration tool.

## Tool Outputs

### 1. `get_design_context(nodeId?)`

**Returns**: React component code with Tailwind CSS

**Example Output**:

```jsx
export default function Rectangle() {
  return <div className="bg-[#d9d9d9] size-full" data-node-id="1:2" />;
}
```

**Key Features**:

- React component structure
- Tailwind CSS classes for styling
- Node IDs preserved in `data-node-id` attributes
- Image references as localhost URLs (e.g., `http://localhost:3845/assets/...`)
- Component hierarchy reflected in React component structure

### ⚠️ Large Design Fallback Behavior

**Discovered during real migration**: When designs are too large, Figma MCP returns **sparse XML
metadata** instead of React/Tailwind code:

**Response for large designs**:

```
IMPORTANT: The design was too large to fit into context with get_design_context.
Instead you have received a sparse metadata response, you MUST call get_design_context
on the IDs of the sublayers to get the full code. Split up the calls to ensure
the sublayers do not also exceed the context limit.
```

**What you receive instead**:

```xml
<frame id="2:4239" name="Light" x="0" y="0" width="1504" height="1698">
  <frame id="2:4240" name="Grid" x="48" y="48" width="1408" height="1602">
    <frame id="2:4241" name="Column" x="0" y="0" width="372.36" height="1602">
      <text id="2:4244" name="Total Revenue" x="0" y="0" width="324.36" height="20" />
      ...
    </frame>
  </frame>
</frame>
```

**Strategy for large designs**:

1. First call `get_design_context()` on the root - you'll get XML metadata
2. Identify key node IDs from the XML structure
3. Call `get_design_context(nodeId)` on specific sub-nodes (e.g., individual columns or cards)
4. Parse the React/Tailwind code for each sub-node
5. Build up the Penpot structure incrementally

**Example chunking approach**:

```javascript
// Step 1: Get root structure (returns XML for large designs)
const rootStructure = await figmaMCP.get_design_context();
// → Returns XML metadata with node IDs

// Step 2: Extract node IDs from XML
const columnIds = ['2:4241', '2:4416', '2:4302']; // From XML parsing

// Step 3: Get detailed code for each column
for (const columnId of columnIds) {
  const columnCode = await figmaMCP.get_design_context(columnId);
  // → Returns React/Tailwind code for that column
  // Parse and create in Penpot
}
```

**What You Get**:

- ✅ Node IDs (in `data-node-id` attributes)
- ✅ Visual styling (via Tailwind classes)
- ✅ Component structure (via React component hierarchy)
- ✅ Image references (via localhost URLs)
- ❌ Raw design properties (fills, strokes, constraints, etc.)
- ❌ Direct access to Figma API properties

**Parsing Required**: To extract design properties, you need to parse:

- Tailwind classes → Extract colors, sizes, spacing, etc.
- Component structure → Extract hierarchy
- Data attributes → Extract node IDs
- Image URLs → Extract image references

### 2. `get_metadata(nodeId?)`

**Returns**: XML-like metadata string

**Example Output**:

```xml
<rounded-rectangle id="1:2" name="Rectangle 1" x="-229" y="-59" width="432" height="301" />
```

**What You Get**:

- ✅ Node ID
- ✅ Node name
- ✅ Position (x, y)
- ✅ Dimensions (width, height)
- ✅ Node type (from tag name)
- ❌ Styling information
- ❌ Children information
- ❌ Style references

**Parsing Required**:

- Parse XML-like string to extract attributes
- Map node types from tag names

### 3. `get_variable_defs(nodeId?)`

**Returns**: Object with variable definitions (may be empty)

**Example Output**:

```json
{}
```

**What You Get**:

- ✅ Variable definitions (if variables exist)
- ✅ Variable values and modes
- ❌ Empty object if no variables

### 4. `get_screenshot(nodeId?)`

**Returns**: Image (visual reference only)

**What You Get**:

- ✅ Visual representation
- ❌ No data (image only)

## Parsing Strategy

### Extracting Design Properties from Code

Since the Figma MCP returns code, you need to parse it:

#### 1. Parse Tailwind Classes

```javascript
function parseTailwindClasses(className) {
  const classes = className.split(' ');
  const properties = {};

  for (const cls of classes) {
    // Background colors: bg-[#hex] or bg-color-name
    if (cls.startsWith('bg-[')) {
      const color = cls.match(/bg-\[([^\]]+)\]/)?.[1];
      properties.backgroundColor = color;
    }

    // Sizes: size-full, w-100, h-200
    if (cls === 'size-full') {
      properties.width = '100%';
      properties.height = '100%';
    } else if (cls.startsWith('w-')) {
      properties.width = cls.replace('w-', '');
    } else if (cls.startsWith('h-')) {
      properties.height = cls.replace('h-', '');
    }

    // Spacing: p-4, m-2, gap-4
    if (cls.startsWith('p-')) {
      properties.padding = cls.replace('p-', '');
    } else if (cls.startsWith('m-')) {
      properties.margin = cls.replace('m-', '');
    } else if (cls.startsWith('gap-')) {
      properties.gap = cls.replace('gap-', '');
    }

    // Flexbox: flex, flex-row, flex-col, items-center, justify-between
    if (cls === 'flex') properties.display = 'flex';
    if (cls === 'flex-row') properties.flexDirection = 'row';
    if (cls === 'flex-col') properties.flexDirection = 'column';
    if (cls.startsWith('items-')) {
      properties.alignItems = cls.replace('items-', '');
    }
    if (cls.startsWith('justify-')) {
      properties.justifyContent = cls.replace('justify-', '');
    }
  }

  return properties;
}
```

#### 2. Extract Node IDs

```javascript
function extractNodeIds(code) {
  const nodeIdRegex = /data-node-id="([^"]+)"/g;
  const nodeIds = [];
  let match;

  while ((match = nodeIdRegex.exec(code)) !== null) {
    nodeIds.push({
      nodeId: match[1],
      element: match.input // The element containing the ID
    });
  }

  return nodeIds;
}
```

#### 3. Extract Image References

```javascript
function extractImageReferences(code) {
  const imageRegex = /http:\/\/localhost:\d+\/assets\/[^\s"']+/g;
  const images = code.match(imageRegex) || [];
  return images;
}
```

#### 4. Parse Component Structure

```javascript
function parseComponentStructure(code) {
  // Parse React component structure
  // Extract component hierarchy
  // Map to design structure
}
```

## Comparison: Figma Plugin API vs Figma MCP

### Figma Plugin API (Used in Existing Codebase)

**Direct Access**:

```javascript
// Direct access to node properties
node.name; // String
node.x; // Number
node.y; // Number
node.width; // Number
node.height; // Number
node.fills; // Array of Paint objects
node.strokes; // Array of Paint objects
node.cornerRadius; // Number
node.opacity; // Number
node.blendMode; // String
node.constraints; // Object
node.layoutMode; // String
node.children; // Array of SceneNode
// ... and many more properties
```

**Advantages**:

- ✅ Direct access to all properties
- ✅ No parsing required
- ✅ Type-safe (TypeScript definitions)
- ✅ Complete design data

**Limitations**:

- ❌ Requires Figma Plugin environment
- ❌ Not available via MCP

### Figma MCP (Current Implementation)

**Code Output**:

```jsx
// React/Tailwind code representation
<div className="bg-[#d9d9d9] size-full" data-node-id="1:2" />
```

**Advantages**:

- ✅ Available via MCP
- ✅ Includes visual styling
- ✅ Preserves node IDs
- ✅ Includes image references

**Limitations**:

- ❌ Requires parsing code to extract properties
- ❌ Not all properties may be represented
- ❌ Tailwind classes need interpretation
- ❌ May lose some design information

## Migration Strategy with Figma MCP

### Option 1: Parse Code Output

1. Get code from `get_design_context()`
2. Parse React component structure
3. Extract Tailwind classes
4. Map to design properties
5. Transform to Penpot format

**Pros**: Works with current MCP **Cons**: Requires parsing, may lose some data

### Option 2: Use Metadata + Code Combination

1. Use `get_metadata()` for basic properties (position, size)
2. Use `get_design_context()` for styling
3. Combine information
4. Fill gaps with reasonable defaults

**Pros**: Gets basic properties directly **Cons**: Still requires parsing for styling

### Option 3: Request Raw Data Access

If possible, request access to raw Figma API data via MCP:

- Direct node property access
- Complete design information
- No parsing required

**Pros**: Complete data access **Cons**: May not be available in current MCP

## Recommended Approach

For migration purposes, use a **hybrid approach**:

1. **Use `get_metadata()`** for:
   - Node IDs
   - Basic properties (x, y, width, height)
   - Node types
   - Hierarchy (from XML structure)

2. **Use `get_design_context()`** for:
   - Visual styling (parse Tailwind classes)
   - Component structure
   - Image references

3. **Parse and Combine**:
   - Extract properties from both sources
   - Combine into complete node representation
   - Map to Penpot format

4. **Handle Missing Data**:
   - Use reasonable defaults for missing properties
   - Log warnings for unsupported features
   - Validate against Penpot requirements

## Example: Parsing a Rectangle

### Input (from Figma MCP):

```jsx
export default function Rectangle() {
  return <div className="bg-[#d9d9d9] size-full" data-node-id="1:2" />;
}
```

### Metadata:

```xml
<rounded-rectangle id="1:2" name="Rectangle 1" x="-229" y="-59" width="432" height="301" />
```

### Parsed Result:

```javascript
{
  id: "1:2",
  name: "Rectangle 1",
  type: "RECTANGLE",
  x: -229,
  y: -59,
  width: 432,
  height: 301,
  fills: [{
    type: "SOLID",
    color: { r: 0.85, g: 0.85, b: 0.85, a: 1 } // #d9d9d9
  }],
  // Missing: strokes, cornerRadius, opacity, blendMode, etc.
  // These would need to be inferred or defaulted
}
```

## Recommendations

1. **Document Limitations**: Clearly document that Figma MCP returns code, not raw data
2. **Provide Parsers**: Create helper functions to parse Tailwind classes and extract properties
3. **Handle Missing Data**: Implement fallbacks for missing properties
4. **Consider Alternatives**: If raw data access is needed, consider:
   - Requesting raw data access in Figma MCP
   - Using Figma Plugin API directly (if available)
   - Building a bridge between Plugin API and MCP

## Status

All documentation complete. Successfully tested with 185-element dashboard migration.
