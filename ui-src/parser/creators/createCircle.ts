import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlur, symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createCircle = (
  context: PenpotContext,
  { type: _type, figmaId, figmaRelatedId, ...shape }: CircleShape
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

  context.addCircle(shape);
};
