import { PenpotContext } from '@ui/lib/types/penpotContext';
import { Paragraph, TextContent, TextNode, TextShape } from '@ui/lib/types/shapes/textShape';
import { parseFigmaId, typographies } from '@ui/parser';
import { symbolBlur, symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createText = (
  context: PenpotContext,
  { type, figmaId, figmaRelatedId, characters, ...shape }: TextShape
) => {
  shape.id = parseFigmaId(context, figmaId);
  shape.shapeRef = parseFigmaId(context, figmaRelatedId, true);
  shape.content = parseContent(context, shape.content);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.blur = symbolBlur(context, shape.blur);
  shape.touched = symbolTouched(
    !shape.hidden,
    characters,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addText(shape);
};

const parseContent = (
  context: PenpotContext,
  content: TextContent | undefined
): TextContent | undefined => {
  if (!content) return;

  content.children = content.children?.map(paragraphSet => {
    paragraphSet.children = paragraphSet.children.map(paragraph => {
      paragraph.children = paragraph.children.map(textNode => {
        return parseTextStyle(context, textNode, textNode.textStyleId) as TextNode;
      });
      return parseTextStyle(context, paragraph, paragraph.textStyleId) as Paragraph;
    });
    return paragraphSet;
  });

  return content;
};

const parseTextStyle = (
  context: PenpotContext,
  text: Paragraph | TextNode,
  textStyleId?: string
): Paragraph | TextNode => {
  let textStyle = text;
  textStyle.fills = symbolFills(context, text.fillStyleId, text.fills);

  const libraryStyle = textStyleId ? typographies.get(textStyleId) : undefined;

  if (libraryStyle) {
    textStyle = {
      ...libraryStyle.textStyle,
      ...textStyle
    };
  }

  return textStyle;
};
