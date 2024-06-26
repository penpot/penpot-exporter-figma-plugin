import { transformFills } from '@plugin/transformers/partials';
import { transformTextStyle, translateTextSegments } from '@plugin/translators/text';
import { translateGrowType, translateVerticalAlign } from '@plugin/translators/text/properties';

import { TextAttributes, TextShape } from '@ui/lib/types/shapes/textShape';

export const transformText = (node: TextNode): TextAttributes & Pick<TextShape, 'growType'> => {
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
    'fills',
    'fillStyleId',
    'textStyleId'
  ]);

  return {
    characters: node.characters,
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
                  children: translateTextSegments(node, styledTextSegments),
                  ...transformTextStyle(node, styledTextSegments[0]),
                  ...transformFills(node)
                }
              ]
            }
          ]
        : undefined
    },
    growType: translateGrowType(node)
  };
};
