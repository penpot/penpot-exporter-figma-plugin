import { degradedLayers } from '@plugin/libraries';
import {
  translateGridAttributes,
  translateGridAttributesWithDefaultTracks,
  translateLayoutAlignContent,
  translateLayoutAlignItems,
  translateLayoutFlexDir,
  translateLayoutGap,
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

// Stable Figma platform bug signature for GridTrackSize reads in dynamic Grid APIs; rethrow all other errors.
const FIGMA_CALLBACK_ERROR_SIGNATURE = 'Attempted to invoke callback with invalid id';

const isFigmaCallbackError = (error: unknown): boolean => {
  return error instanceof Error && error.message.includes(FIGMA_CALLBACK_ERROR_SIGNATURE);
};

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
  } catch (error) {
    if (!isFigmaCallbackError(error)) throw error;

    try {
      const fallback = {
        ...commonAttributes,
        ...translateGridAttributesWithDefaultTracks(node)
      };

      registerDegradedGridLayer(node, 'exported with default grid track sizing (Figma API error)');

      return fallback;
    } catch (error) {
      if (!isFigmaCallbackError(error)) throw error;

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
