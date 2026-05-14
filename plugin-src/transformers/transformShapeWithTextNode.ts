import {
  transformBlend,
  transformDimension,
  transformIds,
  transformRotationAndPosition,
  transformSceneNode,
  transformText
} from '@plugin/transformers/partials';
import { transformNodeAsImageRect } from '@plugin/transformers/transformNodeAsImageRect';
import {
  isPathShapeType,
  translateShapeWithTextPath,
  translateStrokes,
  translateZeroRotation
} from '@plugin/translators';
import { translateFills } from '@plugin/translators/fills';
import { generateDeterministicUuid } from '@plugin/utils';

import type { CircleShape } from '@ui/lib/types/shapes/circleShape';
import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';

const SHAPE_TEXT_PADDING = 8;
const DEFAULT_ROUNDED_RECT_RADIUS = 16;

// Phase 1: primitive shapes that map to native Penpot rect/circle.
const PRIMITIVE_GEOMETRIC_SHAPES = new Set<ShapeWithTextNode['shapeType']>([
  'SQUARE',
  'ROUNDED_RECTANGLE',
  'ELLIPSE'
]);

const buildPrimitiveChild = (node: ShapeWithTextNode): RectShape | CircleShape => {
  const x = node.absoluteTransform[0][2];
  const y = node.absoluteTransform[1][2];
  const fills = translateFills(node.fills);
  const strokes = translateStrokes(node);

  const baseAttrs = {
    x,
    y,
    width: node.width,
    height: node.height,
    blocked: false,
    hidden: false,
    fills,
    strokes,
    ...translateZeroRotation()
  };

  if (node.shapeType === 'ELLIPSE') {
    return {
      type: 'circle',
      name: 'ellipse',
      id: generateDeterministicUuid(`shape-with-text-geom-${node.id}`),
      ...baseAttrs
    } as CircleShape;
  }

  const cornerRadius =
    node.shapeType === 'ROUNDED_RECTANGLE' ? (node.cornerRadius ?? DEFAULT_ROUNDED_RECT_RADIUS) : 0;

  return {
    type: 'rect',
    name: node.shapeType === 'ROUNDED_RECTANGLE' ? 'rounded-rectangle' : 'square',
    id: generateDeterministicUuid(`shape-with-text-geom-${node.id}`),
    r1: cornerRadius,
    r2: cornerRadius,
    r3: cornerRadius,
    r4: cornerRadius,
    ...baseAttrs
  } as RectShape;
};

const buildPathChild = (node: ShapeWithTextNode): PathShape => {
  const x = node.absoluteTransform[0][2];
  const y = node.absoluteTransform[1][2];
  const content = translateShapeWithTextPath(
    node.shapeType as Parameters<typeof translateShapeWithTextPath>[0],
    { x, y },
    { width: node.width, height: node.height }
  );

  return {
    type: 'path',
    name: node.shapeType.toLowerCase(),
    id: generateDeterministicUuid(`shape-with-text-geom-${node.id}`),
    content,
    fills: translateFills(node.fills),
    strokes: translateStrokes(node),
    selrect: {
      x,
      y,
      x1: x,
      y1: y,
      x2: x + node.width,
      y2: y + node.height,
      width: node.width,
      height: node.height
    },
    blocked: false,
    hidden: false,
    ...translateZeroRotation()
  };
};

const buildTextChild = (node: ShapeWithTextNode): TextShape => {
  const text = node.text as unknown as TextNode;
  const x = node.absoluteTransform[0][2] + SHAPE_TEXT_PADDING;
  const y = node.absoluteTransform[1][2] + SHAPE_TEXT_PADDING;
  const width = Math.max(node.width - SHAPE_TEXT_PADDING * 2, 1);
  const height = Math.max(node.height - SHAPE_TEXT_PADDING * 2, 1);

  return {
    type: 'text',
    name: 'text',
    id: generateDeterministicUuid(`shape-with-text-text-${node.id}`),
    x,
    y,
    width,
    height,
    blocked: false,
    hidden: false,
    ...translateZeroRotation(),
    ...transformText(text)
  };
};

const buildGeometricChild = (
  node: ShapeWithTextNode
): RectShape | CircleShape | PathShape | undefined => {
  if (PRIMITIVE_GEOMETRIC_SHAPES.has(node.shapeType)) {
    return buildPrimitiveChild(node);
  }
  if (isPathShapeType(node.shapeType)) {
    return buildPathChild(node);
  }
  return undefined;
};

export const transformShapeWithTextNode = async (
  node: ShapeWithTextNode
): Promise<FrameShape | RectShape | undefined> => {
  const geometricChild = buildGeometricChild(node);
  if (!geometricChild) {
    return transformNodeAsImageRect(node);
  }

  return {
    type: 'frame',
    name: node.name || 'Shape',
    showContent: true,
    hideInViewer: !node.visible,
    fills: [],
    ...transformIds(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    children: [geometricChild, buildTextChild(node)]
  };
};
