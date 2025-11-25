# Documentation Contribution Rules

Rules for maintaining clean, consolidated documentation.

---

## Structure

```
docs/
├── README.md                  # Index only - just links
├── LLM_MIGRATION_GUIDE.md     # Single source of truth
├── LLM_QUICK_REFERENCE.md     # Lookup tables only
├── LLM_UNIVERSAL_CHECKLIST.md # Migration checklist
├── FIGMA_MCP_DATA_FORMAT.md   # Figma MCP specifics
└── CONTRIBUTING.md            # This file
```

---

## Rules

### 1. Single Source of Truth

**All migration knowledge goes in `LLM_MIGRATION_GUIDE.md`**

- New discovery? → Add to relevant section
- New pattern? → Add to "Code Examples"
- New gotcha? → Add to "Common Gotchas" (numbered)

❌ Don't create: `LLM_*_FIXES.md`, `LLM_*_ISSUES.md`, `LLM_*_REFERENCE.md`

### 2. Quick Reference = Lookup Only

**`LLM_QUICK_REFERENCE.md` contains:**

- Tables (mappings, conversions)
- Code snippets (minimal, correct)
- Numbered gotchas list

**Does NOT contain:**

- Explanations
- Tutorials
- Duplicated guide content

### 3. No New Files

- Don't create new docs without explicit request
- Add learnings to existing sections
- If something doesn't fit anywhere, add a new section to `LLM_MIGRATION_GUIDE.md`

### 4. Update, Don't Fragment

| When you learn...  | Add it to...                         |
| ------------------ | ------------------------------------ |
| New API pattern    | Guide → "Critical API Patterns"      |
| New gotcha         | Guide → "Common Gotchas" + Quick Ref |
| New code example   | Guide → "Code Examples"              |
| New mapping        | Quick Ref → relevant table           |
| Figma MCP behavior | `FIGMA_MCP_DATA_FORMAT.md`           |
| Document a gap     | **Remove from "Known Gaps" section** |

### 5. README = Index Only

**Contains:**

- Links to the docs
- Quick code reminder (5-10 lines max)

**Does NOT contain:**

- Duplicated content
- Detailed explanations

---

## Checklist Before Committing

- [ ] No new `LLM_*.md` files created
- [ ] New learnings added to existing sections
- [ ] Quick Reference has no explanations
- [ ] README only has links
- [ ] No duplicate information across files
- [ ] If documenting a gap → remove it from "Known Gaps" section
