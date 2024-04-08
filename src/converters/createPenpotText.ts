import slugify from 'slugify';

import { TextData } from '../interfaces';
import { PenpotFile } from '../penpot';
import {
  translateFills,
  translateFontStyle,
  translateHorizontalAlign,
  translateTextDecoration,
  translateTextTransform,
  translateVerticalAlign
} from '../translators';
import { validateFont } from '../validators';

export const createPenpotText = (
  file: PenpotFile,
  node: TextData,
  baseX: number,
  baseY: number
) => {
  const children = node.children.map(val => {
    validateFont(val.fontName);

    return {
      lineHeight: val.lineHeight,
      fontStyle: 'normal',
      textAlign: translateHorizontalAlign(node.textAlignHorizontal),
      fontId: 'gfont-' + slugify(val.fontName.family.toLowerCase()),
      fontSize: val.fontSize.toString(),
      fontWeight: val.fontWeight.toString(),
      fontVariantId: translateFontStyle(val.fontName.style),
      textDecoration: translateTextDecoration(val),
      textTransform: translateTextTransform(val),
      letterSpacing: val.letterSpacing,
      fills: translateFills(val.fills /*, node.width, node.height*/),
      fontFamily: val.fontName.family,
      text: val.characters
    };
  });

  validateFont(node.fontName);

  file.createText({
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    rotation: 0,
    type: Symbol.for('text'),
    content: {
      type: 'root',
      verticalAlign: translateVerticalAlign(node.textAlignVertical),
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              lineHeight: node.lineHeight,
              fontStyle: 'normal',
              children: children,
              textTransform: translateTextTransform(node),
              textAlign: translateHorizontalAlign(node.textAlignHorizontal),
              fontId: 'gfont-' + slugify(node.fontName.family.toLowerCase()),
              fontSize: node.fontSize.toString(),
              fontWeight: node.fontWeight.toString(),
              type: 'paragraph',
              textDecoration: translateTextDecoration(node),
              letterSpacing: node.letterSpacing,
              fills: translateFills(node.fills /*, node.width, node.height*/),
              fontFamily: node.fontName.family
            }
          ]
        }
      ]
    }
  });
};
