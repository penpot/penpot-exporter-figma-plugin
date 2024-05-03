import { transformFills } from '@plugin/transformers/partials';
import {
  transformTextStyle,
  translateGrowType,
  translateStyleTextSegments,
  translateVerticalAlign
} from '@plugin/translators/text';

import { TextShape } from '@ui/lib/types/text/textShape';

export const transformText = (node: TextNode): Partial<TextShape> => {
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
    content: {
      type: 'root',
      verticalAlign: translateVerticalAlign(node.textAlignVertical),
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              children: translateStyleTextSegments(node, styledTextSegments),
              ...(styledTextSegments.length ? transformTextStyle(node, styledTextSegments[0]) : {}),
              ...transformFills(node)
            }
          ]
        }
      ]
    },
    growType: translateGrowType(node)
  };
};
