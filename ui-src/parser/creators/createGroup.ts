import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { parseFigmaId } from '@ui/parser';
import { createItems } from '@ui/parser/creators';
import { symbolTouched } from '@ui/parser/creators/symbols';

export const createGroup = (
  context: PenpotContext,
  { type: _type, children = [], figmaId, figmaRelatedId, ...shape }: GroupShape
): void => {
  shape.id = parseFigmaId(context, figmaId);
  shape.shapeRef = parseFigmaId(context, figmaRelatedId);
  shape.touched = symbolTouched(
    !shape.hidden,
    undefined,
    shape.touched,
    shape.componentPropertyReferences
  );

  context.addGroup(shape);

  createItems(context, children);

  context.closeGroup();
};
