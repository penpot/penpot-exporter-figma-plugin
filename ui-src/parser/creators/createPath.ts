import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createPath = (context: PenpotContext, { type: _type, ...shape }: PathShape): void => {
  shape.fills = symbolFills(context, shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addPath(shape);
};
