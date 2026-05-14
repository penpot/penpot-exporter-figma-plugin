import {
  transformBlend,
  transformDimension,
  transformFills,
  transformIds,
  transformRotationAndPosition,
  transformSceneNode,
  transformText
} from '@plugin/transformers/partials';
import { translateZeroRotation } from '@plugin/translators';
import { generateDeterministicUuid, generateUuid } from '@plugin/utils';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';
import type { Shadow } from '@ui/lib/types/utils/shadow';

const STICKY_PADDING = 24;
const STICKY_CORNER_RADIUS = 4;
const STICKY_AUTHOR_FONT_SIZE = 12;
const STICKY_AUTHOR_FONT_FAMILY = 'sourcesanspro';
const STICKY_AUTHOR_HEIGHT = 20;
const STICKY_AUTHOR_GAP = 8;
const STICKY_MIN_HEIGHT_FOR_AUTHOR = 80;
const STICKY_AUTHOR_FILL_COLOR = '#000000';
const STICKY_AUTHOR_FILL_OPACITY = 0.6;

const buildStickyShadow = (): Shadow => ({
  id: generateUuid(),
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

const showAuthor = (node: StickyNode): boolean =>
  node.authorVisible && Boolean(node.authorName) && node.height >= STICKY_MIN_HEIGHT_FOR_AUTHOR;

// Sticky text is a TextSublayerNode (no resize/textAutoResize), but every
// property `transformText` reads at runtime is also available on the sublayer.
// Casting through TextNode keeps the existing styled-text pipeline working.
const transformStickyBodyText = (node: StickyNode): TextShape => {
  const text = node.text as unknown as TextNode;
  const x = node.absoluteTransform[0][2] + STICKY_PADDING;
  const y = node.absoluteTransform[1][2] + STICKY_PADDING;
  const width = Math.max(node.width - STICKY_PADDING * 2, 1);
  const authorReserve = showAuthor(node) ? STICKY_AUTHOR_HEIGHT + STICKY_AUTHOR_GAP : 0;
  const height = Math.max(node.height - STICKY_PADDING * 2 - authorReserve, 1);

  return {
    type: 'text',
    name: 'text',
    id: generateDeterministicUuid(`sticky-text-${node.id}`),
    x,
    y,
    width,
    height,
    blocked: node.locked,
    hidden: false,
    ...translateZeroRotation(),
    ...transformText(text)
  };
};

const transformStickyAuthorText = (node: StickyNode): TextShape => {
  const x = node.absoluteTransform[0][2] + STICKY_PADDING;
  const y = node.absoluteTransform[1][2] + node.height - STICKY_PADDING - STICKY_AUTHOR_HEIGHT;
  const width = Math.max(node.width - STICKY_PADDING * 2, 1);

  const fills = [
    {
      fillColor: STICKY_AUTHOR_FILL_COLOR,
      fillOpacity: STICKY_AUTHOR_FILL_OPACITY
    }
  ];

  return {
    type: 'text',
    name: 'author',
    id: generateDeterministicUuid(`sticky-author-${node.id}`),
    x,
    y,
    width,
    height: STICKY_AUTHOR_HEIGHT,
    blocked: node.locked,
    hidden: false,
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
              fills,
              children: [
                {
                  text: node.authorName,
                  fontFamily: STICKY_AUTHOR_FONT_FAMILY,
                  fontSize: `${STICKY_AUTHOR_FONT_SIZE}`,
                  fills
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
};

export const transformStickyNode = (node: StickyNode): FrameShape => {
  const children: TextShape[] = [transformStickyBodyText(node)];
  if (showAuthor(node)) {
    children.push(transformStickyAuthorText(node));
  }

  return {
    type: 'frame',
    name: node.name || 'Sticky',
    showContent: true,
    hideInViewer: !node.visible,
    r1: STICKY_CORNER_RADIUS,
    r2: STICKY_CORNER_RADIUS,
    r3: STICKY_CORNER_RADIUS,
    r4: STICKY_CORNER_RADIUS,
    shadow: [buildStickyShadow()],
    ...transformIds(node),
    ...transformFills(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    children
  };
};
