// import slugify from 'slugify';
import { ExportFile, TextData } from '../../common/interfaces';
import { TextNode } from '../lib/types/text/textContent';
import {
  translateFills, // translateFontStyle,
  // translateHorizontalAlign,
  translateTextDecoration,
  translateTextTransform // translateVerticalAlign
} from '../translators';

export const createPenpotText = (
  file: ExportFile,
  node: TextData,
  baseX: number,
  baseY: number
) => {
  const children = node.children.map(val => {
    file.fontNames.add(val.fontName);

    return {
      text: val.characters,
      fills: translateFills(val.fills, node.width, node.height),
      fontFamily: val.fontName.family,
      fontSize: val.fontSize.toString(),
      fontStyle: val.fontName.style,
      fontWeight: val.fontWeight.toString(),
      textDecoration: translateTextDecoration(val),
      textTransform: translateTextTransform(val)
      // lineHeight: val.lineHeight,
      // textAlign: translateHorizontalAlign(node.textAlignHorizontal),
      // fontId: 'gfont-' + slugify(val.fontName.family.toLowerCase()),
      // fontVariantId: translateFontStyle(val.fontName.style),
      // letterSpacing: val.letterSpacing,
    } as TextNode;
  });
  file.fontNames.add(node.fontName);

  file.penpotFile.createText({
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    // rotation: 0,
    type: Symbol.for('text'),
    content: {
      type: 'root',
      // verticalAlign: translateVerticalAlign(node.textAlignVertical),
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              fills: translateFills(node.fills, node.width, node.height),
              fontFamily: node.fontName.family,
              fontSize: node.fontSize.toString(),
              fontStyle: node.fontName.style,
              fontWeight: node.fontWeight.toString(),
              textDecoration: translateTextDecoration(node),
              textTransform: translateTextTransform(node),
              children: children
              // lineHeight: node.lineHeight,
              // textAlign: translateHorizontalAlign(node.textAlignHorizontal),
              // fontId: 'gfont-' + slugify(node.fontName.family.toLowerCase()),
              // letterSpacing: node.letterSpacing,
            }
          ]
        }
      ]
    }
  });
};
