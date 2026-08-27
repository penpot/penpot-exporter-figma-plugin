import { degradedLayers } from '@plugin/libraries';
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

type GridAttributes = Pick<
  LayoutAttributes,
  'layoutGridDir' | 'layoutGridRows' | 'layoutGridColumns' | 'layoutGridCells'
>;

const translateGridAttributes = (node: BaseFrameMixin): GridAttributes => ({
  layoutGridDir: translateLayoutGridDir(node.layoutMode),
  layoutGridRows: translateGridTracks(node.gridRowSizes),
  layoutGridColumns: translateGridTracks(node.gridColumnSizes),
  layoutGridCells: translateGridCells(node)
});

const translateGridAttributesWithDefaultTracks = (node: BaseFrameMixin): GridAttributes => ({
  layoutGridDir: translateLayoutGridDir(node.layoutMode),
  layoutGridRows: Array.from({ length: node.gridRowSizes.length }, () => ({
    type: 'flex' as const,
    value: 1
  })),
  layoutGridColumns: Array.from({ length: node.gridColumnSizes.length }, () => ({
    type: 'flex' as const,
    value: 1
  })),
  layoutGridCells: translateGridCells(node)
});

const registerDegradedGridLayer = (node: BaseFrameMixin, detail: string): void => {
  const sceneNode = node as unknown as SceneNode;

  console.warn(`Penpot Exporter: grid layer "${sceneNode.name}" ${detail}`);
  degradedLayers.set(sceneNode.id, `${sceneNode.name}: ${detail}`);
};

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

  try {
    return {
      ...commonAttributes,
      ...translateGridAttributes(node)
    };
  } catch {
    try {
      const fallback = {
        ...commonAttributes,
        ...translateGridAttributesWithDefaultTracks(node)
      };

      registerDegradedGridLayer(node, 'exported with default grid track sizing (Figma API error)');

      return fallback;
    } catch {
      registerDegradedGridLayer(node, 'exported without grid layout (Figma API error)');

      return {};
    }
  }
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
