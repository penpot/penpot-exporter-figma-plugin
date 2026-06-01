import {
  type FillsLike,
  transformChildIds,
  transformDimensionAndPosition,
  transformFills,
  transformIds,
  transformSceneNode
} from '@plugin/transformers/partials';
import { translateZeroRotation } from '@plugin/translators';
import { STYLED_TEXT_SEGMENT_FIELDS, buildTextContent } from '@plugin/translators/text';
import type { ParagraphMixin, TextSegment } from '@plugin/translators/text/paragraph';
import { generateDeterministicUuid } from '@plugin/utils';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';
import type { Shadow } from '@ui/lib/types/utils/shadow';

// Hardcoded v1 styling — FigJam does not expose sticky padding, shadow, or the
// author footer styling via API. These values approximate the Figma render.
const STICKY_PADDING = 16;
const STICKY_AUTHOR_FONT_SIZE = 12;
const STICKY_AUTHOR_FONT_FAMILY = 'Source Sans Pro';
const STICKY_AUTHOR_HEIGHT = 20;
const STICKY_AUTHOR_GAP = 8;
const STICKY_MIN_HEIGHT_FOR_AUTHOR = 80;
const STICKY_AUTHOR_PAINT: SolidPaint = {
  type: 'SOLID',
  color: { r: 0, g: 0, b: 0 },
  opacity: 0.6,
  visible: true,
  blendMode: 'NORMAL'
};

type FramePosition = ReturnType<typeof transformDimensionAndPosition>;
type ChildLayout = { x: number; y: number; width: number; height: number };

const showAuthor = (node: StickyNode): boolean =>
  node.authorVisible && Boolean(node.authorName) && node.height >= STICKY_MIN_HEIGHT_FOR_AUTHOR;

const buildStickyShadow = (node: StickyNode): Shadow => ({
  id: generateDeterministicUuid(`sticky-shadow-${node.id}`),
  style: 'drop-shadow',
  offsetX: 0,
  offsetY: 4,
  blur: 12,
  spread: 0,
  hidden: false,
  color: {
    color: '#000000',
    opacity: 0.1
  }
});

export const transformStickyNode = (node: StickyNode): FrameShape => {
  const dimensionAndPosition = transformDimensionAndPosition(node);
  const withAuthor = showAuthor(node);

  const children: TextShape[] = [];
  const bodyChild = buildBodyChild(node, dimensionAndPosition, withAuthor);
  if (bodyChild) children.push(bodyChild);
  if (withAuthor) children.push(buildAuthorChild(node, dimensionAndPosition));

  return {
    type: 'frame',
    name: node.name,
    showContent: true,
    hideInViewer: !node.visible,
    r1: 0,
    r2: 0,
    r3: 0,
    r4: 0,
    shadow: [buildStickyShadow(node)],
    ...transformIds(node),
    ...transformFills(node),
    ...dimensionAndPosition,
    ...transformSceneNode(node),
    ...translateZeroRotation(),
    children
  };
};

const buildStickyTextChild = (
  node: StickyNode,
  characters: string,
  paragraphMixin: ParagraphMixin & FillsLike,
  segments: TextSegment[],
  layout: ChildLayout,
  childIndex: number
): TextShape => ({
  type: 'text',
  name: characters,
  x: layout.x,
  y: layout.y,
  width: Math.max(layout.width, 0),
  height: Math.max(layout.height, 0),
  characters,
  content: buildTextContent(paragraphMixin, segments, 'left', 'top'),
  growType: 'fixed',
  ...transformChildIds(node, childIndex),
  ...translateZeroRotation()
});

const buildBodyChild = (
  node: StickyNode,
  frame: FramePosition,
  withAuthor: boolean
): TextShape | undefined => {
  if (node.text.characters.length === 0) return;

  const segments = node.text.getStyledTextSegments(STYLED_TEXT_SEGMENT_FIELDS);
  const paragraphMixin: ParagraphMixin & FillsLike = {
    paragraphIndent: node.text.paragraphIndent,
    paragraphSpacing: node.text.paragraphSpacing,
    listSpacing: node.text.listSpacing,
    fills: node.text.fills,
    fillStyleId: node.text.fillStyleId
  };

  const authorReserve = withAuthor ? STICKY_AUTHOR_HEIGHT + STICKY_AUTHOR_GAP : 0;

  return buildStickyTextChild(
    node,
    node.text.characters,
    paragraphMixin,
    segments,
    {
      x: frame.x + STICKY_PADDING,
      y: frame.y + STICKY_PADDING,
      width: frame.width - STICKY_PADDING * 2,
      height: frame.height - STICKY_PADDING * 2 - authorReserve
    },
    0
  );
};

const buildAuthorChild = (node: StickyNode, frame: FramePosition): TextShape => {
  const paragraphMixin: ParagraphMixin & FillsLike = {
    paragraphIndent: 0,
    paragraphSpacing: 0,
    listSpacing: 0,
    fills: [STICKY_AUTHOR_PAINT],
    fillStyleId: ''
  };
  const segments: TextSegment[] = [
    {
      characters: node.authorName,
      start: 0,
      end: node.authorName.length,
      fontName: { family: STICKY_AUTHOR_FONT_FAMILY, style: 'Regular' },
      fontSize: STICKY_AUTHOR_FONT_SIZE,
      fontWeight: 400,
      lineHeight: { unit: 'AUTO' },
      letterSpacing: { unit: 'PIXELS', value: 0 },
      textCase: 'ORIGINAL',
      textDecoration: 'NONE',
      indentation: 0,
      listOptions: { type: 'NONE' },
      fills: [STICKY_AUTHOR_PAINT],
      fillStyleId: '',
      textStyleId: ''
    }
  ];

  return buildStickyTextChild(
    node,
    node.authorName,
    paragraphMixin,
    segments,
    {
      x: frame.x + STICKY_PADDING,
      y: frame.y + frame.height - STICKY_PADDING - STICKY_AUTHOR_HEIGHT,
      width: frame.width - STICKY_PADDING * 2,
      height: STICKY_AUTHOR_HEIGHT
    },
    1
  );
};
