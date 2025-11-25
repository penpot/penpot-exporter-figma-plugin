# Figma → Penpot Migration Documentation

Documentation for migrating Figma designs to Penpot using Model Context Protocol (MCP) servers.

---

## 📚 Essential Documents

| Document                                                       | Purpose                                       |
| -------------------------------------------------------------- | --------------------------------------------- |
| **[LLM_MIGRATION_GUIDE.md](./LLM_MIGRATION_GUIDE.md)**         | Complete comprehensive guide - **START HERE** |
| **[LLM_QUICK_REFERENCE.md](./LLM_QUICK_REFERENCE.md)**         | Lookup tables and code snippets               |
| **[LLM_UNIVERSAL_CHECKLIST.md](./LLM_UNIVERSAL_CHECKLIST.md)** | Migration checklist                           |
| **[FIGMA_MCP_DATA_FORMAT.md](./FIGMA_MCP_DATA_FORMAT.md)**     | Figma MCP output format                       |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)**                       | Rules for maintaining these docs              |

---

## 🚀 Quick Start

1. **Read** `LLM_MIGRATION_GUIDE.md` for complete instructions
2. **Reference** `LLM_QUICK_REFERENCE.md` for lookups during migration
3. **Check** `LLM_UNIVERSAL_CHECKLIST.md` to ensure nothing is missed

---

## ⚠️ Critical Rules (Quick Reference)

```javascript
// ✅ Use resize() - width/height are read-only
shape.resize(200, 100);

// ✅ Use dir, rowGap, columnGap for FlexLayout
flex.dir = 'column';
flex.rowGap = 16;

// ✅ Use characters for text
text.characters = 'Hello';

// ✅ Use hex colors directly
fills: [{ fillColor: '#ffffff' }];

// ✅ Add FlexLayout BEFORE children
const flex = board.addFlexLayout();
board.appendChild(child); // child at x=0, y=0

// ✅ Set path position AFTER content
path.content = 'M 0 0 L 100 50';
path.x = 100; // After content!

// ✅ Use relative multipliers for lineHeight
text.lineHeight = '1.2'; // Not "16"
```

---

## 🎯 From Real Migration (185 Elements)

- ✅ Hex colors work directly (`"#ffffff"`)
- ✅ borderRadius works on boards
- ✅ SVG path strings work for `path.content`
- ✅ Large designs: query sub-nodes with `get_design_context(nodeId)`
- ✅ Font fallback: use `sourcesanspro`
