import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { BoolOperations, BoolShape } from '@ui/lib/types/shapes/boolShape';
import { BOOL_DIFFERENCE } from '@ui/lib/types/shapes/boolShape';
import { createItems } from '@ui/parser/creators';
import { symbolFills, symbolStrokes, symbolTouched } from '@ui/parser/creators/symbols';
import type { PenpotNode } from '@ui/types';

// Boards cannot take part in a boolean operation, so Penpot never inherits the
// appearance from them, no matter where they sit among the children.
const BOARD_TYPES = ['frame', 'component', 'instance'];

export const createBool = (
  context: PenpotContext,
  { type: _type, children = [], boolType, ...shape }: BoolShape
): void => {
  // Penpot builds the bool shape out of one of its children and discards the fills
  // and strokes set on the bool itself. In Figma it works the other way around: the
  // boolean operation node paints the whole result and its children are not rendered
  // on their own. Propagating them keeps the Figma appearance.
  propagateAppearanceToInheritingChild(shape, children, boolType);

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

/**
 * This overwrites the fills the inheriting child brought along, which is a deliberate
 * trade-off: `addBool` derives the appearance of the bool from that child and offers
 * no way to set it afterwards, so either the bool or that one child ends up with the
 * wrong paints. The bool wins, because it is the one that paints the result — the
 * fills of a child are dormant in Penpot and in Figma alike, and only ever show up
 * once the boolean operation is dissolved.
 */
const propagateAppearanceToInheritingChild = (
  shape: Omit<BoolShape, 'type' | 'children' | 'boolType'>,
  children: PenpotNode[],
  boolType: BoolOperations
): void => {
  const child = inheritingChild(children, boolType);

  if (!child) return;

  child.fills = shape.fills;
  child.fillStyleId = shape.fillStyleId;
  child.strokes = shape.strokes;
};

/**
 * A difference keeps the shape it subtracts from as its base, so Penpot inherits the
 * appearance from the first child. Every other operation folds the children together
 * and ends up with the appearance of the last one.
 */
const inheritingChild = (
  children: PenpotNode[],
  boolType: BoolOperations
): PenpotNode | undefined => {
  const candidates = children.filter(child => !BOARD_TYPES.includes(child.type ?? ''));

  return boolType === 'difference' || boolType === BOOL_DIFFERENCE
    ? candidates[0]
    : candidates[candidates.length - 1];
};
