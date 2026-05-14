import {
  transformBlend,
  transformDimension,
  transformIds,
  transformRotationAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateNodeAsImageFill } from '@plugin/translators';

import type { RectShape } from '@ui/lib/types/shapes/rectShape';

// Shared helper for node types Penpot cannot model natively. The node is
// rasterized to PNG and embedded as an image fill on a rect. Used by node-type
// specific transformers as a fallback strategy.
export type RasterizableNode =
  | TableNode
  | ShapeWithTextNode
  | HighlightNode
  | StampNode
  | WashiTapeNode
  | WidgetNode
  | EmbedNode
  | LinkUnfurlNode
  | MediaNode
  | CodeBlockNode;

const hasBlend = (node: RasterizableNode): node is RasterizableNode & MinimalBlendMixin =>
  'opacity' in node && 'blendMode' in node;

export const transformNodeAsImageRect = async (
  node: RasterizableNode
): Promise<RectShape | undefined> => {
  const fill = await translateNodeAsImageFill(node);
  if (!fill) return;

  return {
    type: 'rect',
    name: node.name,
    ...transformIds(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...(hasBlend(node) ? transformBlend(node) : {}),
    fills: [fill]
  };
};
