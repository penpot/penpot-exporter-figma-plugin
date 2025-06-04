import { PenpotContext } from '@ui/lib/types/penpotContext';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { parseFigmaId } from '@ui/parser';
import { createItems } from '@ui/parser/creators';
import { symbolBlur, symbolTouched } from '@ui/parser/creators/symbols';

export const createGroup = (
  context: PenpotContext,
  { type, children = [], figmaId, figmaRelatedId, ...shape }: GroupShape
) => {
  shape.id = parseFigmaId(context, figmaId);
  shape.shapeRef = parseFigmaId(context, figmaRelatedId, true);
  shape.blur = symbolBlur(context, shape.blur);
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
