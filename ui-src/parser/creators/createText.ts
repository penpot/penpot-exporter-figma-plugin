import { PenpotFile } from '@ui/lib/types/penpotFile';
import { Paragraph, TextContent, TextNode, TextShape } from '@ui/lib/types/shapes/textShape';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';
import { uiTextLibraries } from '@ui/parser/libraries/UiTextLibraries';

export const createText = (
  file: PenpotFile,
  { type, figmaId, figmaRelatedId, ...shape }: TextShape
) => {
  shape.id = parseFigmaId(file, figmaId);
  shape.shapeRef = parseFigmaId(file, figmaRelatedId, true);
  shape.content = parseContent(shape.content);
  shape.strokes = symbolStrokes(shape.strokes);

  console.log(shape);

  file.createText(shape);
};

const parseContent = (content: TextContent | undefined): TextContent | undefined => {
  if (!content) return;

  content.children = content.children?.map(paragraphSet => {
    paragraphSet.children = paragraphSet.children.map(paragraph => {
      paragraph.children = paragraph.children.map(textNode => {
        return parseTextStyle(textNode, textNode.textStyleId) as TextNode;
      });
      return parseTextStyle(paragraph, paragraph.textStyleId) as Paragraph;
    });
    return paragraphSet;
  });

  return content;
};

const parseTextStyle = (text: Paragraph | TextNode, textStyleId?: string): Paragraph | TextNode => {
  const textStyle = textStyleId
    ? uiTextLibraries.get(textStyleId)?.textStyle
    : {
        fontFamily: text.fontFamily,
        fontSize: text.fontSize,
        fontStyle: text.fontStyle,
        textDecoration: text.textDecoration,
        letterSpacing: text.letterSpacing,
        lineHeight: text.lineHeight
      };

  return {
    ...textStyle,
    ...text,
    fills: symbolFills(text.fillStyleId, text.fills)
  };
};
