import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlur, symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createPath = (
  context: PenpotContext,
  { type: _type, figmaId, figmaRelatedId, ...shape }: PathShape
): void => {
  shape.id = parseFigmaId(context, figmaId);
  shape.shapeRef = parseFigmaId(context, figmaRelatedId, true);
  shape.fills = symbolFills(context, shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.blur = symbolBlur(context, shape.blur);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addPath(shape);
};
