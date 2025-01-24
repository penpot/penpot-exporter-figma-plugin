import {
  translateGrids,
  translateLayoutAlignContent,
  translateLayoutAlignItems,
  translateLayoutFlexDir,
  translateLayoutGap,
  translateLayoutItemAlignSelf,
  translateLayoutJustifyContent,
  translateLayoutJustifyItems,
  translateLayoutPadding,
  translateLayoutPaddingType,
  translateLayoutSizing,
  translateLayoutWrapType
} from '@plugin/translators';

import { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformAutoLayout = (node: BaseFrameMixin): LayoutAttributes => {
  return {
    layout: node.layoutMode !== 'NONE' ? 'flex' : undefined,
    layoutFlexDir: translateLayoutFlexDir(node.layoutMode),
    layoutGap: translateLayoutGap(
      node.layoutMode,
      node.itemSpacing,
      node.primaryAxisAlignItems === 'SPACE_BETWEEN'
    ),
    layoutWrapType: translateLayoutWrapType(node.layoutWrap),
    layoutPadding: translateLayoutPadding(node),
    layoutPaddingType: translateLayoutPaddingType(node),
    layoutJustifyContent: translateLayoutJustifyContent(node),
    layoutJustifyItems: translateLayoutJustifyItems(node),
    layoutAlignContent: translateLayoutAlignContent(node),
    layoutAlignItems: translateLayoutAlignItems(node)
  };
};

export const transformLayoutAttributes = (
  node: LayoutMixin,
  isFrame: boolean = false
): Pick<
  LayoutChildAttributes,
  | 'layoutItemH-Sizing'
  | 'layoutItemV-Sizing'
  | 'layoutItemAlignSelf'
  | 'layoutItemAbsolute'
  | 'layoutItemMaxH'
  | 'layoutItemMinH'
  | 'layoutItemMaxW'
  | 'layoutItemMinW'
> => {
  return {
    'layoutItemH-Sizing': translateLayoutSizing(node.layoutSizingHorizontal, isFrame),
    'layoutItemV-Sizing': translateLayoutSizing(node.layoutSizingVertical, isFrame),
    'layoutItemAlignSelf': translateLayoutItemAlignSelf(node.layoutAlign),
    'layoutItemAbsolute': node.layoutPositioning === 'ABSOLUTE',
    'layoutItemMaxH': node.maxHeight ?? undefined,
    'layoutItemMinH': node.minHeight ?? undefined,
    'layoutItemMaxW': node.maxWidth ?? undefined,
    'layoutItemMinW': node.minWidth ?? undefined
  };
};

export const transformLayoutGrids = (node: BaseFrameMixin): Pick<ShapeAttributes, 'grids'> => {
  return {
    grids: translateGrids(node.layoutGrids)
  };
};
