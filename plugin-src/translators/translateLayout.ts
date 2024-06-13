import {
  JustifyAlignContent,
  JustifyAlignItems,
  LayoutFlexDir,
  LayoutGap,
  LayoutPadding,
  LayoutSizing,
  LayoutWrapType
} from '@ui/lib/types/shapes/layout';

type FigmaLayoutMode = 'NONE' | 'HORIZONTAL' | 'VERTICAL';

type FigmaWrap = 'NO_WRAP' | 'WRAP';

type FigmaLayoutSizing = 'FIXED' | 'HUG' | 'FILL';

export const translateLayoutFlexDir = (layoutMode: FigmaLayoutMode): LayoutFlexDir | undefined => {
  switch (layoutMode) {
    case 'HORIZONTAL':
      return 'row-reverse';
    case 'VERTICAL':
      return 'column-reverse';
    default:
      return;
  }
};

export const translateLayoutGap = (
  layoutMode: FigmaLayoutMode,
  itemSpacing: number,
  auto: boolean = false
): LayoutGap => {
  if (auto) {
    return {
      rowGap: 0,
      columnGap: 0
    };
  }

  return {
    rowGap: layoutMode === 'VERTICAL' ? itemSpacing : 0,
    columnGap: layoutMode === 'HORIZONTAL' ? itemSpacing : 0
  };
};

export const translateLayoutWrapType = (wrap: FigmaWrap): LayoutWrapType => {
  switch (wrap) {
    case 'NO_WRAP':
      return 'nowrap';
    case 'WRAP':
      return 'wrap';
  }
};

export const translateLayoutPadding = (node: BaseFrameMixin): LayoutPadding => {
  return {
    p1: node.paddingTop,
    p2: node.paddingRight,
    p3: node.paddingBottom,
    p4: node.paddingLeft
  };
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
    default:
      return 'stretch';
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

export const translateLayoutSizing = (sizing: FigmaLayoutSizing): LayoutSizing => {
  switch (sizing) {
    case 'FIXED':
      return 'fix';
    case 'HUG':
      return 'auto';
    case 'FILL':
      return 'fill';
  }
};
