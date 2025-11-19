import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { CircleShape } from '@ui/lib/types/shapes/circleShape';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createCircle = (
  context: PenpotContext,
  { type: _type, ...shape }: CircleShape
): void => {
  shape.fills = symbolFills(context, shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addCircle(shape);
};
