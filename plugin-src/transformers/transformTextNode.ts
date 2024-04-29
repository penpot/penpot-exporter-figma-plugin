import {
  transformBlend,
  transformDimensionAndPosition,
  transformEffects,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes,
  transformTextStyle
} from '@plugin/transformers/partials';
import {
  translateGrowType,
  translateStyledTextSegments,
  translateVerticalAlign
} from '@plugin/translators';

import { TextShape } from '@ui/lib/types/text/textShape';

export const transformTextNode = (node: TextNode, baseX: number, baseY: number): TextShape => {
  const styledTextSegments = node.getStyledTextSegments([
    'fontName',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textCase',
    'textDecoration',
    'fills'
  ]);

  const segments = translateStyledTextSegments(node, styledTextSegments);

  return {
    type: 'text',
    name: node.name,
    content: {
      type: 'root',
      verticalAlign: translateVerticalAlign(node.textAlignVertical),
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              children: segments,
              ...(styledTextSegments.length ? transformTextStyle(node, styledTextSegments[0]) : {}),
              ...transformFills(node)
            }
          ]
        }
      ]
    },
    growType: translateGrowType(node),
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformStrokes(node)
  };
};
