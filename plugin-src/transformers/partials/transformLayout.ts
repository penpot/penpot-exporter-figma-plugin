import {
  translateLayoutAlignContent,
  translateLayoutAlignItems,
  translateLayoutFlexDir,
  translateLayoutGap,
  translateLayoutJustifyContent,
  translateLayoutJustifyItems,
  translateLayoutPadding,
  translateLayoutSizing,
  translateLayoutWrapType
} from '@plugin/translators';

import { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';

export const transformAutoLayout = (node: BaseFrameMixin): LayoutAttributes => {
  return {
    layout: node.layoutMode !== 'NONE' ? 'flex' : undefined,
    layoutFlexDir: translateLayoutFlexDir(node.layoutMode),
    layoutGap: translateLayoutGap(node.layoutMode, node.itemSpacing),
    layoutWrapType: translateLayoutWrapType(node.layoutWrap),
    layoutPadding: translateLayoutPadding(node),
    layoutJustifyContent: translateLayoutJustifyContent(node),
    layoutJustifyItems: translateLayoutJustifyItems(node),
    layoutAlignContent: translateLayoutAlignContent(node),
    layoutAlignItems: translateLayoutAlignItems(node)
  };
};

export const transformLayoutSizing = (
  node: LayoutMixin
): Pick<LayoutChildAttributes, 'layoutItemH-Sizing' | 'layoutItemV-Sizing'> => {
  return {
    'layoutItemH-Sizing': translateLayoutSizing(node.layoutSizingHorizontal),
    'layoutItemV-Sizing': translateLayoutSizing(node.layoutSizingVertical)
  };
};

export const transformAutoLayoutPosition = (
  node: AutoLayoutChildrenMixin
): Pick<LayoutChildAttributes, 'layoutItemAbsolute'> => {
  return {
    layoutItemAbsolute: node.layoutPositioning === 'ABSOLUTE'
  };
};
