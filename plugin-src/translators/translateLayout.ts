import { transformId } from '@plugin/transformers/partials';
import { generateUuid } from '@plugin/utils/generateUuid';

import type {
  GridCell,
  GridCellAlignSelf,
  GridCellJustifySelf,
  GridTrack,
  JustifyAlignContent,
  JustifyAlignItems,
  LayoutAlignSelf,
  LayoutFlexDir,
  LayoutGap,
  LayoutGridDir,
  LayoutMode,
  LayoutPadding,
  LayoutSizing,
  LayoutWrapType
} from '@ui/lib/types/shapes/layout';
import type { Uuid } from '@ui/lib/types/utils/uuid';

type FigmaLayoutSizing = 'FIXED' | 'HUG' | 'FILL';

type FigmaLayoutAlign = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT';

export const translateLayoutMode = (
  layoutMode: AutoLayoutMixin['layoutMode']
): LayoutMode | undefined => {
  switch (layoutMode) {
    case 'HORIZONTAL':
    case 'VERTICAL':
      return 'flex';
    case 'GRID':
      return 'grid';
    default:
      return;
  }
};

export const translateLayoutGridDir = (
  layoutMode: AutoLayoutMixin['layoutMode']
): LayoutGridDir | undefined => {
  switch (layoutMode) {
    case 'GRID':
      return 'row';
    default:
      return;
  }
};

export const translateLayoutFlexDir = (
  layoutMode: AutoLayoutMixin['layoutMode']
): LayoutFlexDir | undefined => {
  switch (layoutMode) {
    case 'HORIZONTAL':
      return 'row-reverse';
    case 'VERTICAL':
      return 'column-reverse';
    default:
      return;
  }
};

export const translateLayoutGap = (node: BaseFrameMixin): LayoutGap | undefined => {
  if (node.layoutMode === 'NONE') return;

  if (node.layoutMode === 'GRID') {
    return {
      rowGap: node.gridRowGap,
      columnGap: node.gridColumnGap
    };
  }

  const primaryAxisSpacing = node.primaryAxisAlignItems === 'SPACE_BETWEEN' ? 0 : node.itemSpacing;

  const counterAxisSpacing =
    node.layoutWrap === 'WRAP'
      ? node.counterAxisAlignContent === 'SPACE_BETWEEN'
        ? 0
        : (node.counterAxisSpacing ?? undefined)
      : 0;

  if (node.layoutMode === 'HORIZONTAL') {
    return {
      rowGap: counterAxisSpacing,
      columnGap: primaryAxisSpacing
    };
  }

  if (node.layoutMode === 'VERTICAL') {
    return {
      rowGap: primaryAxisSpacing,
      columnGap: counterAxisSpacing
    };
  }
};

export const translateLayoutWrapType = (node: BaseFrameMixin): LayoutWrapType | undefined => {
  if (node.layoutMode !== 'HORIZONTAL') {
    return;
  }

  switch (node.layoutWrap) {
    case 'NO_WRAP':
      return 'nowrap';
    case 'WRAP':
      return 'wrap';
  }
};

/**
 * If height is the same as the padding top and bottom, we need to reduce a bit the paddings to avoid a bug in Penpot
 * Same happens for width and padding left and right.
 *
 * Just reducing 0.0001 is enough to avoid the bug.
 *
 * Figma allows the padding to be even greater than height or width, but we cannot fix all scenarios, because it
 * means to modify the padding (that could also be linked to a token).
 */
export const translateLayoutPadding = (node: BaseFrameMixin): LayoutPadding => {
  let p1 = node.paddingTop;
  let p2 = node.paddingRight;
  let p3 = node.paddingBottom;
  let p4 = node.paddingLeft;

  if (node.height > 0 && node.height === p1 + p3) {
    p1 = p1 - 0.0001;
    p3 = p3 - 0.0001;
  }

  if (node.width > 0 && node.width === p2 + p4) {
    p2 = p2 - 0.0001;
    p4 = p4 - 0.0001;
  }

  return {
    p1,
    p2,
    p3,
    p4
  };
};

export const translateLayoutPaddingType = (node: BaseFrameMixin): 'simple' | 'multiple' => {
  if (node.paddingTop === node.paddingBottom && node.paddingRight === node.paddingLeft) {
    return 'simple';
  }

  return 'multiple';
};

export const translateLayoutJustifyContent = (node: BaseFrameMixin): JustifyAlignContent => {
  switch (node.primaryAxisAlignItems) {
    case 'MIN':
      return 'start';
    case 'CENTER':
      return 'center';
    case 'MAX':
      return 'end';
    case 'SPACE_BETWEEN':
      return 'space-between';
  }
};

export const translateLayoutJustifyItems = (node: BaseFrameMixin): JustifyAlignItems => {
  switch (node.primaryAxisAlignItems) {
    case 'MIN':
      return 'start';
    case 'CENTER':
      return 'center';
    case 'MAX':
      return 'end';
    default:
      return 'stretch';
  }
};

export const translateLayoutAlignContent = (node: BaseFrameMixin): JustifyAlignContent => {
  if (node.counterAxisAlignContent === 'SPACE_BETWEEN') {
    return 'space-between';
  }

  switch (node.counterAxisAlignItems) {
    case 'MIN':
      return 'start';
    case 'CENTER':
      return 'center';
    case 'MAX':
      return 'end';
    default:
      return 'stretch';
  }
};

export const translateLayoutAlignItems = (node: BaseFrameMixin): JustifyAlignItems => {
  switch (node.counterAxisAlignItems) {
    case 'MIN':
      return 'start';
    case 'CENTER':
      return 'center';
    case 'MAX':
      return 'end';
    default:
      return 'stretch';
  }
};

export const translateLayoutSizing = (
  sizing: FigmaLayoutSizing,
  isFrame: boolean = false,
  isText: boolean = false
): LayoutSizing => {
  switch (sizing) {
    case 'FIXED':
      return 'fix';
    case 'HUG':
      // @TODO: Penpot does not handle hug in text as figma does
      return isText ? 'fix' : 'auto';
    case 'FILL':
      // @TODO: Penpot does not handle fill in frames or text as figma does
      return isFrame || isText ? 'fix' : 'fill';
  }
};

export const translateLayoutItemAlignSelf = (align: FigmaLayoutAlign): LayoutAlignSelf => {
  switch (align) {
    case 'MIN':
      return 'start';
    case 'CENTER':
      return 'center';
    case 'MAX':
      return 'end';
    default:
      return 'stretch';
  }
};

const translateGridTrack = (gridTrack: GridTrackSize): GridTrack => {
  return {
    type: gridTrack.type === 'FLEX' ? 'flex' : 'fixed',
    value: gridTrack.value
  };
};

export const translateGridTracks = (tracks: GridTrackSize[]): GridTrack[] => {
  return tracks.map(translateGridTrack);
};

const translateGridCellAlignSelf = (
  verticalAlign: GridChildrenMixin['gridChildVerticalAlign']
): GridCellAlignSelf => {
  switch (verticalAlign) {
    case 'MIN':
      return 'start';
    case 'CENTER':
      return 'center';
    case 'MAX':
      return 'end';
    case 'AUTO':
      return 'auto';
  }
};

const translateGridCellJustifySelf = (
  horizontalAlign: GridChildrenMixin['gridChildHorizontalAlign']
): GridCellJustifySelf => {
  switch (horizontalAlign) {
    case 'MIN':
      return 'start';
    case 'CENTER':
      return 'center';
    case 'MAX':
      return 'end';
    case 'AUTO':
      return 'auto';
  }
};

const translateGridCell = (
  id: string,
  row: number,
  column: number,
  child: (GridChildrenMixin & SceneNode) | undefined
): GridCell => {
  if (!child) {
    return {
      alignSelf: 'auto',
      column: column + 1,
      columnSpan: 1,
      id,
      justifySelf: 'auto',
      position: 'auto',
      row: row + 1,
      rowSpan: 1,
      shapes: []
    };
  }

  return {
    alignSelf: translateGridCellAlignSelf(child.gridChildVerticalAlign),
    column: column + 1,
    columnSpan: child.gridColumnSpan,
    id,
    justifySelf: translateGridCellJustifySelf(child.gridChildHorizontalAlign),
    position: 'manual',
    row: row + 1,
    rowSpan: child.gridRowSpan,
    shapes: [transformId(child)]
  };
};

const gridPositionKey = (row: number, column: number): string => `${row}:${column}`;

const indexGridChildren = (
  children: readonly (GridChildrenMixin & SceneNode)[]
): {
  anchors: Map<string, GridChildrenMixin & SceneNode>;
  occupied: Set<string>;
} => {
  const anchors = new Map<string, GridChildrenMixin & SceneNode>();
  const occupied = new Set<string>();

  for (const child of children) {
    const rowAnchor = child.gridRowAnchorIndex;
    const columnAnchor = child.gridColumnAnchorIndex;

    if (typeof rowAnchor !== 'number' || typeof columnAnchor !== 'number') {
      continue;
    }

    const anchorKey = gridPositionKey(rowAnchor, columnAnchor);
    anchors.set(anchorKey, child);

    const rowSpan = Math.max(1, child.gridRowSpan ?? 1);
    const columnSpan = Math.max(1, child.gridColumnSpan ?? 1);

    for (let row = rowAnchor; row < rowAnchor + rowSpan; row++) {
      for (let column = columnAnchor; column < columnAnchor + columnSpan; column++) {
        occupied.add(gridPositionKey(row, column));
      }
    }
  }

  return { anchors, occupied };
};

export const translateGridCells = (node: BaseFrameMixin): { [uuid: Uuid]: GridCell } => {
  const cells: { [uuid: Uuid]: GridCell } = {};
  const children = node.children as readonly (GridChildrenMixin & SceneNode)[];
  const { anchors, occupied } = indexGridChildren(children);

  for (let row = 0; row < node.gridRowSizes.length; row++) {
    for (let column = 0; column < node.gridColumnSizes.length; column++) {
      const key = gridPositionKey(row, column);
      const child = anchors.get(key);

      if (!child && occupied.has(key)) {
        continue;
      }

      const id = generateUuid();

      cells[id] = translateGridCell(id, row, column, child);
    }
  }

  return cells;
};
