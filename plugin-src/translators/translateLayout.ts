import type {
  JustifyAlignContent,
  JustifyAlignItems,
  LayoutAlignSelf,
  LayoutFlexDir,
  LayoutGap,
  LayoutPadding,
  LayoutSizing,
  LayoutWrapType
} from '@ui/lib/types/shapes/layout';

type FigmaLayoutSizing = 'FIXED' | 'HUG' | 'FILL';

type FigmaLayoutAlign = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT';

export const translateLayoutFlexDir = (
  layoutMode: AutoLayoutMixin['layoutMode']
): LayoutFlexDir | undefined => {
  switch (layoutMode) {
    case 'HORIZONTAL':
      return 'row-reverse';
    case 'VERTICAL':
      return 'column-reverse';
    case 'GRID':
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

export const translateLayoutWrapType = (wrap: AutoLayoutMixin['layoutWrap']): LayoutWrapType => {
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
  isFrame: boolean = false
): LayoutSizing => {
  switch (sizing) {
    case 'FIXED':
      return 'fix';
    case 'HUG':
      return 'auto';
    case 'FILL':
      return isFrame ? 'fix' : 'fill'; // @TODO: Penpot does not handle fill in frames as figma does
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
