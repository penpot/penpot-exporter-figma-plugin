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

// Hardcoded v1 styling — FigJam does not expose sticky padding, corner radius,
// shadow, or the author footer styling via API. These values approximate the
// Figma render.
const STICKY_PADDING = 16;
const STICKY_CORNER_RADIUS = 0;
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
    r1: STICKY_CORNER_RADIUS,
    r2: STICKY_CORNER_RADIUS,
    r3: STICKY_CORNER_RADIUS,
    r4: STICKY_CORNER_RADIUS,
    shadow: [buildStickyShadow(node)],
    ...transformIds(node),
    ...transformFills(node),
    ...dimensionAndPosition,
    ...transformSceneNode(node),
    ...translateZeroRotation(),
    children
  };
};

type FramePosition = ReturnType<typeof transformDimensionAndPosition>;

const buildBodyChild = (
  node: StickyNode,
  frame: FramePosition,
  withAuthor: boolean
): TextShape | undefined => {
  if (node.text.characters.length === 0) return;

  const rawSegments = node.text.getStyledTextSegments(STYLED_TEXT_SEGMENT_FIELDS);
  // Clearing textStyleId avoids FigJam's missing `figma.getStyleByIdAsync` API.
  const segments: TextSegment[] = rawSegments.map(segment => ({
    ...segment,
    textStyleId: ''
  }));

  const paragraphMixin: ParagraphMixin & FillsLike = {
    paragraphIndent: node.text.paragraphIndent,
    paragraphSpacing: node.text.paragraphSpacing,
    listSpacing: node.text.listSpacing,
    fills: node.text.fills,
    fillStyleId: node.text.fillStyleId
  };

  const authorReserve = withAuthor ? STICKY_AUTHOR_HEIGHT + STICKY_AUTHOR_GAP : 0;

  return {
    type: 'text',
    name: node.text.characters,
    x: frame.x + STICKY_PADDING,
    y: frame.y + STICKY_PADDING,
    width: Math.max(frame.width - STICKY_PADDING * 2, 0),
    height: Math.max(frame.height - STICKY_PADDING * 2 - authorReserve, 0),
    characters: node.text.characters,
    content: buildTextContent(paragraphMixin, segments, 'left', 'top'),
    growType: 'fixed',
    ...transformChildIds(node, 0),
    ...translateZeroRotation()
  };
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

  return {
    type: 'text',
    name: node.authorName,
    x: frame.x + STICKY_PADDING,
    y: frame.y + frame.height - STICKY_PADDING - STICKY_AUTHOR_HEIGHT,
    width: Math.max(frame.width - STICKY_PADDING * 2, 0),
    height: STICKY_AUTHOR_HEIGHT,
    characters: node.authorName,
    content: buildTextContent(paragraphMixin, segments, 'left', 'top'),
    growType: 'fixed',
    ...transformChildIds(node, 1),
    ...translateZeroRotation()
  };
};
