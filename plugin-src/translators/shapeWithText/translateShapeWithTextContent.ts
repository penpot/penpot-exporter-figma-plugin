import { transformFills } from '@plugin/transformers/partials';
import { transformTextStyle, translateTextSegments } from '@plugin/translators/text';

import type { TextAttributes, TextShape } from '@ui/lib/types/shapes/textShape';

// ShapeWithTextNode embeds text via TextSublayerNode, which does not expose
// textAlignHorizontal/textAlignVertical/textAutoResize. Figma renders these
// shapes with center/center alignment and a fixed size matched to the shape,
// so we hardcode those defaults.
export const translateShapeWithTextContent = (
  node: ShapeWithTextNode
): TextAttributes & Pick<TextShape, 'growType'> => {
  const styledTextSegments = node.text.getStyledTextSegments([
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
    characters: node.text.characters,
    content: {
      type: 'root',
      verticalAlign: 'center',
      children: styledTextSegments.length
        ? [
            {
              type: 'paragraph-set',
              children: [
                {
                  type: 'paragraph',
                  children: translateTextSegments(node.text, styledTextSegments, 'center'),
                  ...transformTextStyle(styledTextSegments[0], 'center'),
                  ...transformFills(node.text)
                }
              ]
            }
          ]
        : undefined
    },
    growType: 'fixed'
  };
};
