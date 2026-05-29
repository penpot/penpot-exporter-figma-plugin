import {
  type FillsLike,
  transformChildIds,
  transformFills,
  transformIds
} from '@plugin/transformers/partials';
import { translateZeroRotation } from '@plugin/translators';
import { STYLED_TEXT_SEGMENT_FIELDS, buildTextContent } from '@plugin/translators/text';
import type { ParagraphMixin, TextSegment } from '@plugin/translators/text/paragraph';
import { generateDeterministicUuid } from '@plugin/utils';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';
import type { Shadow } from '@ui/lib/types/utils/shadow';

const STICKY_PADDING = 16;
const STICKY_CORNER_RADIUS = 0;
const STICKY_AUTHOR_FONT_SIZE = 12;
const STICKY_AUTHOR_FONT_FAMILY = 'sourcesanspro';
const STICKY_AUTHOR_HEIGHT = 20;
const STICKY_AUTHOR_GAP = 8;
const STICKY_MIN_HEIGHT_FOR_AUTHOR = 80;
const STICKY_AUTHOR_FILLS = [{ fillColor: '#000000', fillOpacity: 0.6 }];

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
  const x = node.absoluteTransform[0][2];
  const y = node.absoluteTransform[1][2];
  const withAuthor = showAuthor(node);

  const children: TextShape[] = [];
  const bodyChild = buildBodyChild(node, x, y, withAuthor);
  if (bodyChild) children.push(bodyChild);
  if (withAuthor) children.push(buildAuthorChild(node, x, y));

  return {
    type: 'frame',
    name: node.name,
    showContent: true,
    hideInViewer: !node.visible,
    x,
    y,
    width: node.width,
    height: node.height,
    r1: STICKY_CORNER_RADIUS,
    r2: STICKY_CORNER_RADIUS,
    r3: STICKY_CORNER_RADIUS,
    r4: STICKY_CORNER_RADIUS,
    shadow: [buildStickyShadow(node)],
    ...transformIds(node),
    ...transformFills(node),
    ...translateZeroRotation(),
    children
  };
};

const buildBodyChild = (
  node: StickyNode,
  frameX: number,
  frameY: number,
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
    x: frameX + STICKY_PADDING,
    y: frameY + STICKY_PADDING,
    width: Math.max(node.width - STICKY_PADDING * 2, 0),
    height: Math.max(node.height - STICKY_PADDING * 2 - authorReserve, 0),
    characters: node.text.characters,
    content: buildTextContent(paragraphMixin, segments, 'left', 'top'),
    growType: 'fixed',
    ...transformChildIds(node, 0),
    ...translateZeroRotation()
  };
};

const buildAuthorChild = (node: StickyNode, frameX: number, frameY: number): TextShape => ({
  type: 'text',
  name: node.authorName,
  x: frameX + STICKY_PADDING,
  y: frameY + node.height - STICKY_PADDING - STICKY_AUTHOR_HEIGHT,
  width: Math.max(node.width - STICKY_PADDING * 2, 0),
  height: STICKY_AUTHOR_HEIGHT,
  characters: node.authorName,
  content: {
    type: 'root',
    verticalAlign: 'top',
    children: [
      {
        type: 'paragraph-set',
        children: [
          {
            type: 'paragraph',
            textAlign: 'left',
            fontFamily: STICKY_AUTHOR_FONT_FAMILY,
            fontSize: `${STICKY_AUTHOR_FONT_SIZE}`,
            fills: STICKY_AUTHOR_FILLS,
            children: [
              {
                text: node.authorName,
                fontFamily: STICKY_AUTHOR_FONT_FAMILY,
                fontSize: `${STICKY_AUTHOR_FONT_SIZE}`,
                fills: STICKY_AUTHOR_FILLS
              }
            ]
          }
        ]
      }
    ]
  },
  growType: 'fixed',
  ...transformChildIds(node, 1),
  ...translateZeroRotation()
});
