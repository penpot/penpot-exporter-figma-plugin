import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { BoolShape } from '@ui/lib/types/shapes/boolShape';
import { createItems } from '@ui/parser/creators';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';

export const createBool = (
  context: PenpotContext,
  { type: _type, children = [], boolType, ...shape }: BoolShape
): void => {
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

  try {
    context.addBool({
      groupId,
      type: boolType
    });
  } catch (error) {
    // Boolean groups have a restriction regarding the children in Penpot:
    // You cannot have a boolean group with only frames as direct children.
    //
    // The shape will still be created, but it will be a normal group.
    console.warn('Could not add boolean group', shape.name, error);
  }
};
