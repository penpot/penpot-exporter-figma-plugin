import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createRectangle = (
  context: PenpotContext,
  { type: _type, ...shape }: RectShape
): void => {
  shape.fills = symbolFills(context, shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addRect(shape);
};
