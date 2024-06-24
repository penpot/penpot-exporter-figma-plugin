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
  const commonTextAttrs = {
    ...text,
    fills: symbolFills(text.fillStyleId, text.fills)
  };

  if (textStyleId === undefined) {
    return commonTextAttrs;
  }

  let textLibrary = uiTextLibraries.get(textStyleId);
  if (textLibrary === undefined) {
    return commonTextAttrs;
  }

  textLibrary = {
    textStyle: {
      ...textLibrary.textStyle,
      fontId: text.fontId,
      fontVariantId: text.fontVariantId,
      fontWeight: text.fontWeight
    },
    typography: textLibrary.typography,
    name: textLibrary.name
  };
  uiTextLibraries.register(textStyleId, textLibrary);

  return {
    ...textLibrary.textStyle,
    ...commonTextAttrs
  };
};
