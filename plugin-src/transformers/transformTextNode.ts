import {
  transformBlend,
  transformDimensionAndPosition,
  transformEffects,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformTextStyle
} from '@plugin/transformers/partials';
import { translateStyledTextSegments } from '@plugin/translators';

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

  return {
    type: 'text',
    name: node.name,
    content: {
      type: 'root',
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              children: translateStyledTextSegments(styledTextSegments, node.width, node.height),
              ...(styledTextSegments.length ? transformTextStyle(styledTextSegments[0]) : {}),
              ...transformFills(node)
            }
          ]
        }
      ]
    },
    ...transformDimensionAndPosition(node, baseX, baseY),
    ...transformEffects(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};
