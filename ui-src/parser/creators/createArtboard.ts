import { PenpotContext } from '@ui/lib/types/penpotContext';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { parseFigmaId } from '@ui/parser';
import { createItems } from '@ui/parser/creators';
import { symbolBlur, symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createArtboard = (
  context: PenpotContext,
  { type, children = [], figmaId, figmaRelatedId, ...shape }: FrameShape
): Uuid | undefined => {
  const id = parseFigmaId(context, figmaId);

  shape.id = id;
  shape.shapeRef ??= parseFigmaId(context, figmaRelatedId, true);
  shape.fills = symbolFills(context, shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.blur = symbolBlur(context, shape.blur);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addBoard(shape);

  createItems(context, children);

  context.closeBoard();

  return id;
};
