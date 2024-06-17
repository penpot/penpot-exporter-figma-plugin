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
    'layout': node.layoutMode !== 'NONE' ? 'flex' : undefined,
    'layout-flex-dir': translateLayoutFlexDir(node.layoutMode),
    'layout-gap': translateLayoutGap(
      node.layoutMode,
      node.itemSpacing,
      node.primaryAxisAlignItems === 'SPACE_BETWEEN'
    ),
    'layout-wrap-type': translateLayoutWrapType(node.layoutWrap),
    'layout-padding': translateLayoutPadding(node),
    'layout-justify-content': translateLayoutJustifyContent(node),
    'layout-justify-items': translateLayoutJustifyItems(node),
    'layout-align-content': translateLayoutAlignContent(node),
    'layout-align-items': translateLayoutAlignItems(node)
  };
};

export const transformLayoutAttributes = (
  node: LayoutMixin
): Pick<
  LayoutChildAttributes,
  'layout-item-h-sizing' | 'layout-item-v-sizing' | 'layout-item-absolute'
> => {
  return {
    'layout-item-h-sizing': translateLayoutSizing(node.layoutSizingHorizontal),
    'layout-item-v-sizing': translateLayoutSizing(node.layoutSizingVertical),
    'layout-item-absolute': node.layoutPositioning === 'ABSOLUTE'
  };
};
