import { translateFillStyle, translateFills } from '@plugin/translators/fills';
import { StyleTextSegment } from '@plugin/translators/text/paragraph';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';
import { TextStyle } from '@ui/lib/types/shapes/textShape';

export const transformFills = (
  node:
    | (MinimalFillsMixin & DimensionAndPositionMixin)
    | VectorRegion
    | VectorNode
    | StyleTextSegment
): Pick<ShapeAttributes, 'fills' | 'fillStyleId'> | Pick<TextStyle, 'fills' | 'fillStyleId'> => {
  if (hasFillStyle(node)) {
    return {
      fills: [],
      fillStyleId: translateFillStyle(node.fillStyleId, node.fills)
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
  node:
    | (MinimalFillsMixin & DimensionAndPositionMixin)
    | VectorRegion
    | VectorNode
    | StyleTextSegment
): boolean => {
  return (
    node.fillStyleId !== figma.mixed &&
    node.fillStyleId !== undefined &&
    node.fillStyleId.length > 0
  );
};
