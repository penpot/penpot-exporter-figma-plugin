import {
  type FillsLike,
  transformChildIds,
  transformFills,
  transformIds
} from '@plugin/transformers/partials';
import { translateZeroRotation } from '@plugin/translators';
import { STYLED_TEXT_SEGMENT_FIELDS, buildTextContent } from '@plugin/translators/text';
import type { ParagraphMixin, TextSegment } from '@plugin/translators/text/paragraph';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';

const STICKY_PADDING = 24;
const STICKY_CORNER_RADIUS = 4;

export const transformStickyNode = (node: StickyNode): FrameShape => {
  const x = node.absoluteTransform[0][2];
  const y = node.absoluteTransform[1][2];

  const children: TextShape[] = [];
  const textChild = buildTextChild(node, x, y);
  if (textChild) children.push(textChild);

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
    ...transformIds(node),
    ...transformFills(node),
    ...translateZeroRotation(),
    children
  };
};

const buildTextChild = (
  node: StickyNode,
  frameX: number,
  frameY: number
): TextShape | undefined => {
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

  return {
    type: 'text',
    name: node.text.characters,
    x: frameX + STICKY_PADDING,
    y: frameY + STICKY_PADDING,
    width: Math.max(node.width - STICKY_PADDING * 2, 0),
    height: Math.max(node.height - STICKY_PADDING * 2, 0),
    characters: node.text.characters,
    content: buildTextContent(paragraphMixin, segments, 'center', 'center'),
    growType: 'fixed',
    ...transformChildIds(node, 0),
    ...translateZeroRotation()
  };
};
