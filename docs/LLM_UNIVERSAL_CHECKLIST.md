# Universal Migration Checklist

This checklist ensures **ANY** Figma design can be successfully migrated to Penpot. Use this for every migration, regardless of complexity.

## Pre-Migration Setup

- [ ] Initialize migration state (`storage.migrationState`)
- [ ] Set up ID mapping registry
- [ ] Set up component registry
- [ ] Set up style registry
- [ ] Set up token registry
- [ ] Set up error/warning tracking

## Phase 1: Extraction

### Extract Design Data
- [ ] Extract full structure from Figma MCP (`get_design_context`)
- [ ] Extract metadata for navigation (`get_metadata`)
- [ ] Extract design tokens (`get_variable_defs`)
- [ ] Handle large files (chunk if needed)

### Parse Extracted Data
- [ ] Parse React/Tailwind code (if using Figma MCP)
- [ ] Extract node IDs from `data-node-id` attributes
- [ ] Extract styling from Tailwind classes
- [ ] Extract image references
- [ ] Build complete node hierarchy

## Phase 2: Analysis

### Build Dependency Graph
- [ ] Identify all tokens and their dependencies
- [ ] Identify all styles and their token dependencies
- [ ] Identify all components and their style dependencies
- [ ] Identify all instances and their component dependencies
- [ ] Identify all shapes and their style/component dependencies
- [ ] Check for circular dependencies

### Determine Creation Order
- [ ] Order 1: Tokens (no dependencies)
- [ ] Order 2: Styles (depend on tokens)
- [ ] Order 3: Components (depend on styles)
- [ ] Order 4: Pages (no dependencies)
- [ ] Order 5: Boards/Frames (depend on components)
- [ ] Order 6: Shapes (depend on boards/components/styles)
- [ ] Order 7: Instances (depend on components)
- [ ] Order 8: Groups (depend on shapes)

## Phase 3: Foundation Creation

### Create Tokens (if any)
- [ ] Extract all tokens from Figma
- [ ] Resolve all token aliases
- [ ] Map tokens to Penpot structure
- [ ] Create tokens in Penpot
- [ ] Register token IDs

### Create Styles
- [ ] Extract all paint styles
- [ ] Extract all text styles
- [ ] Resolve token references in styles
- [ ] Create paint styles in Penpot
- [ ] Create text styles in Penpot
- [ ] Register style IDs

### Create Components
- [ ] Extract all component definitions
- [ ] Extract all component sets (variants)
- [ ] Create components in dependency order
- [ ] Link variants together
- [ ] Register component IDs
- [ ] Handle component properties

## Phase 4: Structure Creation

### Create Pages
- [ ] Create all pages
- [ ] Set page names
- [ ] Register page IDs
- [ ] Open first page (or specified page)

### Create Boards/Frames
- [ ] Transform all FRAME nodes to Boards
- [ ] Transform all SECTION nodes to Boards
- [ ] Apply layout (Auto Layout or Grid) if present
- [ ] Apply fills, strokes, effects
- [ ] Set clipContent property
- [ ] Register board IDs

### Create Shapes

#### Basic Shapes
- [ ] Transform RECTANGLE nodes
- [ ] Transform ELLIPSE nodes
- [ ] Transform TEXT nodes
- [ ] Transform VECTOR nodes
- [ ] Transform LINE nodes
- [ ] Transform STAR nodes
- [ ] Transform POLYGON nodes

#### Complex Shapes
- [ ] Transform BOOLEAN_OPERATION nodes (check for 2+ children)
- [ ] Transform GROUP nodes
- [ ] Handle nested structures

#### Component Instances
- [ ] Transform INSTANCE nodes
- [ ] Resolve main component references
- [ ] Apply instance overrides
- [ ] Handle orphaned instances

### Apply Properties

#### Universal Properties (All Shapes)
- [ ] Set name
- [ ] Set position (x, y)
- [ ] Set dimensions (width, height)
- [ ] Set opacity
- [ ] Set visibility
- [ ] Set blend mode
- [ ] Set rotation

#### Type-Specific Properties
- [ ] Rectangle: corner radius
- [ ] Text: font, size, weight, line height, letter spacing, alignment
- [ ] Boolean: operation type
- [ ] Frame/Board: clipContent, layout
- [ ] Vector/Path: path data
- [ ] Instance: component reference, overrides

#### Visual Properties (If Supported)
- [ ] Fills (solid, gradient, image)
- [ ] Strokes (color, width, alignment, cap, join)
- [ ] Effects (shadows, blurs)
- [ ] Constraints (horizontal, vertical)

## Phase 5: Layout Application

### Auto Layout (FlexLayout)
- [ ] Detect layoutMode (HORIZONTAL/VERTICAL)
- [ ] Set flex direction
- [ ] Set gap (itemSpacing)
- [ ] Set padding
- [ ] Set justifyContent (primary axis)
- [ ] Set alignItems (counter axis)
- [ ] Handle nested flex layouts
- [ ] Handle layout sizing (FIXED/HUG/FILL)

### Grid Layout
- [ ] Detect grid layout
- [ ] Set grid columns
- [ ] Set grid rows
- [ ] Set grid gap
- [ ] Handle grid cells
- [ ] Handle nested grids

### Constraints
- [ ] Map horizontal constraints
- [ ] Map vertical constraints
- [ ] Handle SCALE constraints
- [ ] Handle STRETCH constraints

## Phase 6: Relationship Handling

### Parent-Child Relationships
- [ ] Maintain hierarchy (parent → children)
- [ ] Set correct z-order
- [ ] Handle nested groups
- [ ] Handle nested components

### Component Relationships
- [ ] Link instances to components
- [ ] Preserve component hierarchy
- [ ] Handle variant relationships
- [ ] Handle component properties

### Style Relationships
- [ ] Link shapes to paint styles
- [ ] Link text to text styles
- [ ] Resolve style references
- [ ] Handle missing styles

### Token Relationships
- [ ] Resolve token references
- [ ] Map tokens to styles
- [ ] Handle token modes/themes

## Phase 7: Edge Case Handling

### Missing Data
- [ ] Handle missing properties (use defaults)
- [ ] Handle missing children
- [ ] Handle missing components
- [ ] Handle missing styles
- [ ] Handle missing tokens

### Unsupported Features
- [ ] Detect unsupported blend modes
- [ ] Detect unsupported effects
- [ ] Detect unsupported layout features
- [ ] Use closest equivalents
- [ ] Log warnings

### Special Cases
- [ ] Handle SECTION nodes (limited properties)
- [ ] Handle boolean operations without children
- [ ] Handle hidden elements
- [ ] Handle locked elements
- [ ] Handle mixed values (text fills, etc.)

### Error Handling
- [ ] Handle circular dependencies
- [ ] Handle orphaned instances
- [ ] Handle invalid references
- [ ] Handle creation failures
- [ ] Log all errors

## Phase 8: Validation

### Structure Validation
- [ ] Verify all nodes were created
- [ ] Verify all ID mappings exist
- [ ] Verify all references are valid
- [ ] Verify hierarchy is correct
- [ ] Verify z-order is correct

### Component Validation
- [ ] Verify all components exist
- [ ] Verify all instances link correctly
- [ ] Verify variant relationships
- [ ] Verify component properties

### Style Validation
- [ ] Verify all styles exist
- [ ] Verify style references
- [ ] Verify token resolution
- [ ] Verify style application

### Layout Validation
- [ ] Verify layout properties
- [ ] Verify nested layouts
- [ ] Verify constraints
- [ ] Verify responsive behavior

## Phase 9: Large File Handling

### Chunking (If Needed)
- [ ] Split design into chunks
- [ ] Preserve context across chunks
- [ ] Track dependencies between chunks
- [ ] Process chunks in order
- [ ] Reassemble complete structure

### Context Preservation
- [ ] Maintain ID mappings across chunks
- [ ] Maintain component registry
- [ ] Maintain style registry
- [ ] Maintain token registry
- [ ] Pass context to next chunk

### Progress Tracking
- [ ] Track completed chunks
- [ ] Track current chunk
- [ ] Track errors per chunk
- [ ] Track warnings per chunk
- [ ] Create checkpoints

## Phase 10: Finalization

### Cleanup
- [ ] Remove temporary data
- [ ] Clean up failed creations
- [ ] Handle orphaned elements
- [ ] Optimize structure

### Reporting
- [ ] Generate migration report
- [ ] List all created elements
- [ ] List all errors
- [ ] List all warnings
- [ ] List missing features
- [ ] Provide recovery information

### Verification
- [ ] Visual comparison (screenshot)
- [ ] Structure comparison
- [ ] Property comparison
- [ ] Relationship comparison
- [ ] Performance check

## Universal Patterns Applied

- [ ] Used universal node transformation pattern
- [ ] Applied universal properties to all shapes
- [ ] Handled all node types
- [ ] Handled all layout systems
- [ ] Handled all styling systems
- [ ] Handled all edge cases
- [ ] Used universal error handling
- [ ] Used universal validation

## Success Criteria

- [ ] All nodes migrated successfully
- [ ] All relationships preserved
- [ ] All styles applied correctly
- [ ] All components working
- [ ] All layouts functioning
- [ ] No critical errors
- [ ] Warnings documented
- [ ] Migration report generated

## Post-Migration

- [ ] Review migration report
- [ ] Fix any critical errors
- [ ] Address warnings
- [ ] Test functionality
- [ ] Verify visual appearance
- [ ] Document any limitations

---

**This checklist ensures comprehensive migration of ANY Figma design to Penpot, regardless of complexity, size, or features used.**

