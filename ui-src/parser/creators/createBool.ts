import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { parseFigmaId } from '@ui/parser';
import { createItems } from '@ui/parser/creators';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createBool = (
  context: PenpotContext,
  { type: _type, figmaId, figmaRelatedId, children = [], boolType, ...shape }: BoolShape
): void => {
  shape.id = parseFigmaId(context, figmaId);
  shape.shapeRef = parseFigmaId(context, figmaRelatedId);
  shape.fills = symbolFills(context, shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  const groupId = context.addGroup(shape);

  createItems(context, children);

  context.closeGroup();

  context.addBool({
    groupId,
    type: boolType
  });
};
