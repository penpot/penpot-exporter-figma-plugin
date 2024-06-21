import { PenpotFile } from '@ui/lib/types/penpotFile';
import { TextContent, TextShape } from '@ui/lib/types/shapes/textShape';
import { parseFigmaId } from '@ui/parser';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createText = (
  file: PenpotFile,
  { type, figmaId, figmaRelatedId, characters, ...shape }: TextShape
) => {
  shape.id = parseFigmaId(file, figmaId);
  shape.shapeRef = parseFigmaId(file, figmaRelatedId, true);
  shape.content = parseContent(shape.content);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    characters,
    shape.touched,
    shape.componentPropertyReferences
  );

  file.createText(shape);
};

const parseContent = (content: TextContent | undefined): TextContent | undefined => {
  if (!content) return;

  content.children?.forEach(paragraphSet => {
    paragraphSet.children.forEach(paragraph => {
      paragraph.children.forEach(textNode => {
        textNode.fills = symbolFills(textNode.fillStyleId, textNode.fills);
      });

      paragraph.fills = symbolFills(paragraph.fillStyleId, paragraph.fills);
    });
  });

  return content;
};
