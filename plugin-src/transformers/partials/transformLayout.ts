import {
  translateGridCells,
  translateGridTracks,
  translateLayoutAlignContent,
  translateLayoutAlignItems,
  translateLayoutFlexDir,
  translateLayoutGap,
  translateLayoutGridDir,
  translateLayoutItemAlignSelf,
  translateLayoutJustifyContent,
  translateLayoutJustifyItems,
  translateLayoutMode,
  translateLayoutPadding,
  translateLayoutPaddingType,
  translateLayoutSizing,
  translateLayoutWrapType
} from '@plugin/translators';

import type { LayoutAttributes, LayoutChildAttributes } from '@ui/lib/types/shapes/layout';

export const transformAutoLayout = (node: BaseFrameMixin): LayoutAttributes => {
  const layout = translateLayoutMode(node.layoutMode);

  if (layout === undefined) {
    return {};
  }

  const commonAttributes: LayoutAttributes = {
    layout,
    layoutGap: translateLayoutGap(node),
    layoutGapType: 'multiple',
    layoutPadding: translateLayoutPadding(node),
    layoutPaddingType: translateLayoutPaddingType(node),
    layoutJustifyContent: translateLayoutJustifyContent(node),
    layoutJustifyItems: translateLayoutJustifyItems(node),
    layoutAlignContent: translateLayoutAlignContent(node),
    layoutAlignItems: translateLayoutAlignItems(node)
  };

  if (layout === 'flex') {
    return {
      ...commonAttributes,
      layoutFlexDir: translateLayoutFlexDir(node.layoutMode),
      layoutWrapType: translateLayoutWrapType(node)
    };
  }

  return {
    ...commonAttributes,
    layoutGridDir: translateLayoutGridDir(node.layoutMode),
    layoutGridRows: translateGridTracks(node.gridRowSizes),
    layoutGridColumns: translateGridTracks(node.gridColumnSizes),
    layoutGridCells: translateGridCells(node)
  };
};

export const transformLayoutAttributes = (
  node: LayoutMixin,
  isFrame: boolean = false,
  isText: boolean = false
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
    'layoutItemH-Sizing': translateLayoutSizing(node.layoutSizingHorizontal, isFrame, isText),
    'layoutItemV-Sizing': translateLayoutSizing(node.layoutSizingVertical, isFrame, isText),
    'layoutItemAlignSelf': translateLayoutItemAlignSelf(node.layoutAlign),
    'layoutItemAbsolute': node.layoutPositioning === 'ABSOLUTE',
    'layoutItemMaxH': node.maxHeight ?? undefined,
    'layoutItemMinH': node.minHeight ?? undefined,
    'layoutItemMaxW': node.maxWidth ?? undefined,
    'layoutItemMinW': node.minWidth ?? undefined
  };
};
