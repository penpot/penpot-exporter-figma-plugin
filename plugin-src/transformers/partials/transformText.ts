import { transformFills } from '@plugin/transformers/partials';
import { transformTextStyle, translateStyleTextSegments } from '@plugin/translators/text';
import { translateGrowType, translateVerticalAlign } from '@plugin/translators/text/properties';

import { TextShape } from '@ui/lib/types/shapes/textShape';

export const transformText = async (node: TextNode): Promise<Partial<TextShape>> => {
  const styledTextSegments = node.getStyledTextSegments([
    'fontName',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textCase',
    'textDecoration',
    'indentation',
    'listOptions',
    'fills'
  ]);

  return {
    content: {
      type: 'root',
      verticalAlign: translateVerticalAlign(node.textAlignVertical),
      children: styledTextSegments.length
        ? [
            {
              type: 'paragraph-set',
              children: [
                {
                  type: 'paragraph',
                  children: await translateStyleTextSegments(node, styledTextSegments),
                  ...transformTextStyle(node, styledTextSegments[0]),
                  ...(await transformFills(node))
                }
              ]
            }
          ]
        : undefined
    },
    growType: translateGrowType(node)
  };
};
