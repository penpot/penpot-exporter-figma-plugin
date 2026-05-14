import { translateFillStyleId, translateFills } from '@plugin/translators/fills';
import type { TextSegment } from '@plugin/translators/text/paragraph';
import { isFigJamEditor } from '@plugin/utils';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';
import type { TextStyle } from '@ui/lib/types/shapes/textShape';

export const transformFills = (
  node: (MinimalFillsMixin & DimensionAndPositionMixin) | VectorRegion | VectorNode | TextSegment
): Pick<ShapeAttributes, 'fills' | 'fillStyleId'> | Pick<TextStyle, 'fills' | 'fillStyleId'> => {
  if (hasFillStyle(node)) {
    return {
      fills: [],
      fillStyleId: translateFillStyleId(node.fillStyleId)
    };
  }

  return {
    fills: translateFills(node.fills)
  };
};

export const transformVectorFills = (
  node: VectorNode,
  vectorPath: VectorPath,
  vectorRegion: VectorRegion | undefined
): Pick<ShapeAttributes, 'fills' | 'fillStyleId'> => {
  if (vectorPath.windingRule === 'NONE') {
    return {
      fills: []
    };
  }

  const fillsNode = vectorRegion?.fills ? vectorRegion : node;
  return transformFills(fillsNode);
};

const hasFillStyle = (
  node: (MinimalFillsMixin & DimensionAndPositionMixin) | VectorRegion | VectorNode | TextSegment
): boolean => {
  // FigJam has no paint-style concept and exposes no style APIs. Treat every
  // fill as inline so colors come from node.fills directly.
  if (isFigJamEditor()) return false;

  return (
    node.fillStyleId !== figma.mixed &&
    node.fillStyleId !== undefined &&
    node.fillStyleId.length > 0
  );
};
