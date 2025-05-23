import { PenpotContext } from '@ui/lib/types/penpotContext';
import { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { parseFigmaId } from '@ui/parser';
import {
  symbolBoolType,
  symbolFills,
  symbolStrokes,
  symbolTouched
} from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createBool = (
  context: PenpotContext,
  { type, figmaId, figmaRelatedId, children = [], ...shape }: BoolShape
) => {
  shape.id = parseFigmaId(context, figmaId);
  shape.shapeRef = parseFigmaId(context, figmaRelatedId, true);
  shape.fills = symbolFills(context, shape.fillStyleId, shape.fills);
  shape.strokes = symbolStrokes(context, shape.strokes);
  shape.boolType = symbolBoolType(shape.boolType);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addBool(shape);

  createItems(context, children);

  context.closeBool();
};
