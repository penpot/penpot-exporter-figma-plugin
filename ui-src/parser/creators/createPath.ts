import { PenpotContext } from '@ui/lib/types/penpotContext';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { parseFigmaId } from '@ui/parser';
import {
  symbolFills,
  symbolPathContent,
  symbolStrokes,
  symbolTouched
} from '@ui/parser/creators/symbols';

export const createPath = (
  context: PenpotContext,
  { type, figmaId, figmaRelatedId, ...shape }: PathShape
) => {
  shape.id = parseFigmaId(context, figmaId);
  shape.shapeRef = parseFigmaId(context, figmaRelatedId, true);
  shape.fills = symbolFills(shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(shape.strokes);
  shape.content = symbolPathContent(shape.content);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addPath(shape);
};
