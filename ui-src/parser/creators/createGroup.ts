import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { createItems } from '@ui/parser/creators';
import { symbolTouched } from '@ui/parser/creators/symbols';

export const createGroup = (
  context: PenpotContext,
  { type: _type, children = [], ...shape }: GroupShape
): void => {
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
