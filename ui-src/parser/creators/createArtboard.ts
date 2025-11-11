import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { Uuid } from '@ui/lib/types/utils/uuid';
import { createItems } from '@ui/parser/creators';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createArtboard = (
  context: PenpotContext,
  { type: _type, children = [], ...shape }: FrameShape
): Uuid | undefined => {
  shape.fills = symbolFills(context, shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addBoard(shape);

  createItems(context, children);

  context.closeBoard();

  return shape.id;
};
