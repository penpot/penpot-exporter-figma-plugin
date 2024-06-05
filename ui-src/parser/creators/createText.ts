import { PenpotFile } from '@ui/lib/types/penpotFile';
import { TextContent, TextShape } from '@ui/lib/types/shapes/textShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFills, symbolStrokes } from '@ui/parser/creators/symbols';

export const createText = (
  file: PenpotFile,
  { type, blendMode, strokes, figmaId, content, figmaRelatedId, ...rest }: TextShape
) => {
  file.createText({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    content: parseContent(content),
    blendMode: symbolBlendMode(blendMode),
    strokes: symbolStrokes(strokes),
    ...rest
  });
};

const parseContent = (content: TextContent | undefined): TextContent | undefined => {
  if (!content) return;

  content.children?.forEach(paragraphSet => {
    paragraphSet.children.forEach(paragraph => {
      paragraph.children.forEach(textNode => {
        textNode.fills = symbolFills(textNode.fills);
      });

      paragraph.fills = symbolFills(paragraph.fills);
    });
  });

  return content;
};
