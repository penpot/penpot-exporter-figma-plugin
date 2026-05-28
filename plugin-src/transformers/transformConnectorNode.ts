import { type FillsLike, transformChildIds, transformIds } from '@plugin/transformers/partials';
import {
  translateConnectorStrokeCap,
  translateStrokes,
  translateZeroRotation
} from '@plugin/translators';
import { STYLED_TEXT_SEGMENT_FIELDS, buildTextContent } from '@plugin/translators/text';
import type { ParagraphMixin, TextSegment } from '@plugin/translators/text/paragraph';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';
import type { Stroke, StrokeCaps } from '@ui/lib/types/utils/stroke';

type Point = { x: number; y: number };
type ConnectorMagnet = 'NONE' | 'AUTO' | 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT' | 'CENTER';

export const transformConnectorNode = async (
  node: ConnectorNode
): Promise<PathShape | GroupShape | undefined> => {
  const aabb = node.absoluteBoundingBox;
  if (!aabb) return;

  const start = await resolveEndpoint(node, node.connectorStart);
  const end = await resolveEndpoint(node, node.connectorEnd);
  if (!start || !end) return;

  const pathContent = buildPathContent(start, end, node.connectorLineType);
  const strokes = buildStrokes(node);

  const pathShape: PathShape = {
    type: 'path',
    name: node.name,
    content: pathContent,
    strokes,
    fills: [],
    hidden: !node.visible,
    ...transformIds(node),
    ...translateZeroRotation()
  };

  if (node.text.characters.length === 0) {
    return pathShape;
  }

  const label = buildLabelChild(node, start, end);
  if (!label) return pathShape;

  return {
    type: 'group',
    name: node.name,
    x: aabb.x,
    y: aabb.y,
    width: Math.max(aabb.width, 1),
    height: Math.max(aabb.height, 1),
    ...transformIds(node),
    ...translateZeroRotation(),
    children: [pathShape, label]
  };
};

const resolveEndpoint = async (
  connector: ConnectorNode,
  endpoint: ConnectorEndpoint
): Promise<Point | undefined> => {
  if ('endpointNodeId' in endpoint && 'magnet' in endpoint) {
    const target = await figma.getNodeByIdAsync(endpoint.endpointNodeId);
    if (target && 'absoluteBoundingBox' in target && target.absoluteBoundingBox) {
      return magnetPoint(target.absoluteBoundingBox, endpoint.magnet);
    }
  }

  if ('position' in endpoint) {
    const parentOffset = getParentAbsoluteOffset(connector);
    return {
      x: parentOffset.x + endpoint.position.x,
      y: parentOffset.y + endpoint.position.y
    };
  }

  return;
};

const getParentAbsoluteOffset = (node: ConnectorNode): Point => {
  const parent = node.parent;
  if (!parent || !('absoluteTransform' in parent)) {
    return { x: 0, y: 0 };
  }
  return {
    x: parent.absoluteTransform[0][2],
    y: parent.absoluteTransform[1][2]
  };
};

const magnetPoint = (box: Rect, magnet: ConnectorMagnet): Point => {
  switch (magnet) {
    case 'TOP':
      return { x: box.x + box.width / 2, y: box.y };
    case 'BOTTOM':
      return { x: box.x + box.width / 2, y: box.y + box.height };
    case 'LEFT':
      return { x: box.x, y: box.y + box.height / 2 };
    case 'RIGHT':
      return { x: box.x + box.width, y: box.y + box.height / 2 };
    case 'CENTER':
    case 'AUTO':
    case 'NONE':
    default:
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  }
};

const buildPathContent = (
  start: Point,
  end: Point,
  lineType: ConnectorNode['connectorLineType']
): string => {
  if (lineType === 'ELBOWED') {
    const midX = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  }
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
};

const buildStrokes = (node: ConnectorNode): Stroke[] => {
  const startCap = translateConnectorStrokeCap(node.connectorStartStrokeCap);
  const endCap = translateConnectorStrokeCap(node.connectorEndStrokeCap);

  return translateStrokes(node, stroke => applyConnectorCaps(stroke, startCap, endCap));
};

const applyConnectorCaps = (
  stroke: Stroke,
  startCap: StrokeCaps | undefined,
  endCap: StrokeCaps | undefined
): Stroke => {
  const next = { ...stroke };
  if (startCap) next.strokeCapStart = startCap;
  if (endCap) next.strokeCapEnd = endCap;
  return next;
};

const buildLabelChild = (node: ConnectorNode, start: Point, end: Point): TextShape | undefined => {
  if (node.text.characters.length === 0) return;

  const rawSegments = node.text.getStyledTextSegments(STYLED_TEXT_SEGMENT_FIELDS);
  // Clearing textStyleId avoids FigJam's missing `figma.getStyleByIdAsync` API.
  const segments: TextSegment[] = rawSegments.map(segment => ({
    ...segment,
    textStyleId: ''
  }));

  const paragraphMixin: ParagraphMixin & FillsLike = {
    paragraphIndent: 0,
    paragraphSpacing: 0,
    listSpacing: 0,
    fills: node.text.fills,
    fillStyleId: node.text.fillStyleId
  };

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const labelWidth = 120;
  const labelHeight = 24;

  return {
    type: 'text',
    name: node.text.characters,
    x: midX - labelWidth / 2,
    y: midY - labelHeight / 2,
    width: labelWidth,
    height: labelHeight,
    characters: node.text.characters,
    content: buildTextContent(paragraphMixin, segments, 'center', 'center'),
    growType: 'auto-width',
    ...transformChildIds(node, 0),
    ...translateZeroRotation()
  };
};
