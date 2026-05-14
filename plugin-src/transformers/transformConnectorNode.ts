import { transformBlend, transformIds, transformSceneNode } from '@plugin/transformers/partials';
import {
  translateConnectorStrokeCap,
  translateStrokes,
  translateZeroRotation
} from '@plugin/translators';
import { translateFills } from '@plugin/translators/fills';
import { generateDeterministicUuid } from '@plugin/utils';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';
import type { Stroke } from '@ui/lib/types/utils/stroke';

type Point = { x: number; y: number };

const LABEL_FONT_SIZE = 12;
const LABEL_CHAR_WIDTH_RATIO = 0.55;
const LABEL_LINE_HEIGHT_RATIO = 1.4;
const LABEL_PADDING_X = 6;
const LABEL_PADDING_Y = 3;

const magnetPoint = (
  bbox: Rect,
  magnet: 'NONE' | 'AUTO' | 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT' | 'CENTER',
  toward: Point
): Point => {
  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y + bbox.height / 2;

  let resolved = magnet;
  if (resolved === 'AUTO') {
    const dx = toward.x - cx;
    const dy = toward.y - cy;
    resolved =
      Math.abs(dx) > Math.abs(dy) ? (dx >= 0 ? 'RIGHT' : 'LEFT') : dy >= 0 ? 'BOTTOM' : 'TOP';
  }

  switch (resolved) {
    case 'TOP':
      return { x: cx, y: bbox.y };
    case 'LEFT':
      return { x: bbox.x, y: cy };
    case 'BOTTOM':
      return { x: cx, y: bbox.y + bbox.height };
    case 'RIGHT':
      return { x: bbox.x + bbox.width, y: cy };
    case 'CENTER':
    case 'NONE':
    default:
      return { x: cx, y: cy };
  }
};

// Connector endpoint `position` is expressed in the parent container's
// coordinate space (same space as the connector's `relativeTransform`), not
// the page's absolute space. Compute the parent's absolute origin so we can
// translate every endpoint into page coords.
const parentAbsoluteOffset = (connector: ConnectorNode): Point => ({
  x: connector.absoluteTransform[0][2] - connector.relativeTransform[0][2],
  y: connector.absoluteTransform[1][2] - connector.relativeTransform[1][2]
});

const resolveEndpoint = async (
  connector: ConnectorNode,
  endpoint: ConnectorEndpoint,
  otherEndpoint: ConnectorEndpoint
): Promise<Point | undefined> => {
  if ('position' in endpoint) {
    const offset = parentAbsoluteOffset(connector);
    return { x: offset.x + endpoint.position.x, y: offset.y + endpoint.position.y };
  }

  const node = await figma.getNodeByIdAsync(endpoint.endpointNodeId);
  if (!node || !('absoluteBoundingBox' in node) || !node.absoluteBoundingBox) return undefined;

  const offset = parentAbsoluteOffset(connector);
  const toward =
    'position' in otherEndpoint
      ? { x: offset.x + otherEndpoint.position.x, y: offset.y + otherEndpoint.position.y }
      : { x: node.absoluteBoundingBox.x, y: node.absoluteBoundingBox.y };

  return magnetPoint(node.absoluteBoundingBox, endpoint.magnet, toward);
};

const elbowedPath = (start: Point, end: Point): string => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const mx = start.x + dx / 2;
    return `M ${start.x} ${start.y} L ${mx} ${start.y} L ${mx} ${end.y} L ${end.x} ${end.y}`;
  }
  const my = start.y + dy / 2;
  return `M ${start.x} ${start.y} L ${start.x} ${my} L ${end.x} ${my} L ${end.x} ${end.y}`;
};

const curvedPath = (start: Point, end: Point): string => {
  const mx = (start.x + end.x) / 2;
  const my = (start.y + end.y) / 2;
  // Offset perpendicular to the line by ~25% of the length, so the curve is visible
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const offset = Math.hypot(dx, dy) * 0.25;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * offset;
  const cy = my + ny * offset;
  return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
};

const buildPathContent = (
  start: Point,
  end: Point,
  lineType: 'ELBOWED' | 'STRAIGHT' | 'CURVED'
): string => {
  switch (lineType) {
    case 'STRAIGHT':
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    case 'CURVED':
      return curvedPath(start, end);
    case 'ELBOWED':
    default:
      return elbowedPath(start, end);
  }
};

const computeSelrect = (
  start: Point,
  end: Point
): { x: number; y: number; width: number; height: number } => {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.max(Math.abs(end.x - start.x), 1);
  const height = Math.max(Math.abs(end.y - start.y), 1);
  return { x, y, width, height };
};

const buildLabelChildren = (
  node: ConnectorNode,
  midpoint: Point
): [RectShape | undefined, TextShape] | undefined => {
  const characters = node.text.characters;
  if (!characters) return undefined;

  const textWidth = Math.max(characters.length * LABEL_FONT_SIZE * LABEL_CHAR_WIDTH_RATIO, 16);
  const textHeight = LABEL_FONT_SIZE * LABEL_LINE_HEIGHT_RATIO;

  const textX = midpoint.x - textWidth / 2;
  const textY = midpoint.y - textHeight / 2;

  const chipFills = translateFills(node.textBackground.fills);

  const chip: RectShape | undefined = chipFills.length
    ? {
        type: 'rect',
        name: 'label-background',
        id: generateDeterministicUuid(`connector-label-bg-${node.id}`),
        x: textX - LABEL_PADDING_X,
        y: textY - LABEL_PADDING_Y,
        width: textWidth + LABEL_PADDING_X * 2,
        height: textHeight + LABEL_PADDING_Y * 2,
        fills: chipFills,
        blocked: node.locked,
        hidden: false,
        ...translateZeroRotation()
      }
    : undefined;

  const text: TextShape = {
    type: 'text',
    name: 'label',
    id: generateDeterministicUuid(`connector-label-${node.id}`),
    x: textX,
    y: textY,
    width: textWidth,
    height: textHeight,
    blocked: node.locked,
    hidden: false,
    characters,
    content: {
      type: 'root',
      verticalAlign: 'center',
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              textAlign: 'center',
              fontFamily:
                node.text.fontName !== figma.mixed ? node.text.fontName.family : 'sourcesanspro',
              fontSize: `${LABEL_FONT_SIZE}`,
              fills: translateFills(node.text.fills),
              children: [
                {
                  text: characters,
                  fontFamily:
                    node.text.fontName !== figma.mixed
                      ? node.text.fontName.family
                      : 'sourcesanspro',
                  fontSize: `${LABEL_FONT_SIZE}`,
                  fills: translateFills(node.text.fills)
                }
              ]
            }
          ]
        }
      ]
    },
    growType: 'fixed',
    ...translateZeroRotation()
  };

  return [chip, text];
};

export const transformConnectorNode = async (
  node: ConnectorNode
): Promise<PathShape | GroupShape | undefined> => {
  const start = await resolveEndpoint(node, node.connectorStart, node.connectorEnd);
  const end = await resolveEndpoint(node, node.connectorEnd, node.connectorStart);

  if (!start || !end) {
    console.warn(`Connector "${node.name}" has unresolvable endpoints; skipping`);
    return undefined;
  }

  const lineType = node.connectorLineType;
  const content = buildPathContent(start, end, lineType);
  const selrect = computeSelrect(start, end);

  const strokes = translateStrokes(node, (stroke: Stroke): Stroke => {
    const startCap = translateConnectorStrokeCap(node.connectorStartStrokeCap);
    const endCap = translateConnectorStrokeCap(node.connectorEndStrokeCap);
    if (startCap) stroke.strokeCapStart = startCap;
    if (endCap) stroke.strokeCapEnd = endCap;
    return stroke;
  });

  const pathId = generateDeterministicUuid(`connector-path-${node.id}`);

  const path: PathShape = {
    type: 'path',
    name: node.name || 'Connector',
    id: pathId,
    content,
    strokes,
    selrect: {
      x: selrect.x,
      y: selrect.y,
      x1: selrect.x,
      y1: selrect.y,
      x2: selrect.x + selrect.width,
      y2: selrect.y + selrect.height,
      width: selrect.width,
      height: selrect.height
    },
    blocked: node.locked,
    hidden: !node.visible,
    ...transformBlend(node),
    ...translateZeroRotation()
  };

  const label = buildLabelChildren(node, {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  });

  if (!label) return path;

  const [chip, text] = label;
  const groupChildren = chip ? [path, chip, text] : [path, text];

  const groupX = Math.min(selrect.x, chip ? chip.x : text.x, text.x);
  const groupY = Math.min(selrect.y, chip ? chip.y : text.y, text.y);
  const groupRight = Math.max(
    selrect.x + selrect.width,
    chip ? chip.x + chip.width : text.x + text.width,
    text.x + text.width
  );
  const groupBottom = Math.max(
    selrect.y + selrect.height,
    chip ? chip.y + chip.height : text.y + text.height,
    text.y + text.height
  );

  const group: GroupShape = {
    type: 'group',
    name: node.name || 'Connector',
    ...transformIds(node),
    x: groupX,
    y: groupY,
    width: Math.max(groupRight - groupX, 1),
    height: Math.max(groupBottom - groupY, 1),
    ...transformSceneNode(node),
    ...transformBlend(node),
    children: groupChildren,
    ...translateZeroRotation()
  };

  return group;
};
