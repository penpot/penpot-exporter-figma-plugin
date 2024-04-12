import { TextNode as PenpotTextNode } from '../../ui/lib/types/text/textContent';
import { TextShape } from '../../ui/lib/types/text/textShape';
import { translateFills, translateTextDecoration, translateTextTransform } from '../translators';

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

  const children: PenpotTextNode[] = styledTextSegments.map(segment => {
    figma.ui.postMessage({ type: 'FONT_NAME', data: segment.fontName.family });

    return {
      text: segment.characters,
      fills: translateFills(segment.fills, node.width, node.height),
      fontFamily: segment.fontName.family,
      fontSize: segment.fontSize.toString(),
      fontStyle: segment.fontName.style,
      fontWeight: segment.fontWeight.toString(),
      textDecoration: translateTextDecoration(segment),
      textTransform: translateTextTransform(segment)
    };
  });

  return {
    type: 'text',
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    content: {
      type: 'root',
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              fills: translateFills(node.fills, node.width, node.height),
              fontFamily: children[0].fontFamily,
              fontSize: children[0].fontSize,
              fontStyle: children[0].fontStyle,
              fontWeight: children[0].fontWeight,
              textDecoration: children[0].textDecoration,
              textTransform: children[0].textTransform,
              children: children
            }
          ]
        }
      ]
    }
  };
};
