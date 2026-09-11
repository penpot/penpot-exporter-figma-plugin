import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { BoolOperations, BoolShape } from '@ui/lib/types/shapes/boolShape';
import type { Fill } from '@ui/lib/types/utils/fill';
import type { Stroke } from '@ui/lib/types/utils/stroke';
import { colors } from '@ui/parser';
import { createBool } from '@ui/parser/creators/createBool';
import type { PenpotNode } from '@ui/types';

vi.mock('@ui/parser', () => ({
  colors: new Map(),
  images: new Map(),
  components: new Map(),
  componentRoots: new Map(),
  componentProperties: new Map(),
  typographies: new Map()
}));

const addGroup = vi.fn().mockReturnValue('group-id');
const addPath = vi.fn();
const addRect = vi.fn();
const addBoard = vi.fn();

const context = {
  addGroup,
  closeGroup: vi.fn(),
  addBool: vi.fn(),
  addPath,
  addRect,
  addBoard,
  closeBoard: vi.fn()
} as unknown as PenpotContext;

const black: Fill[] = [{ fillColor: '#000000', fillOpacity: 1 }];
const white: Fill[] = [{ fillColor: '#ffffff', fillOpacity: 1 }];
const strokes: Stroke[] = [{ strokeColor: '#ff0000', strokeWidth: 2 }];

const path = (name: string, fills: Fill[] = []): PenpotNode =>
  ({ type: 'path', name, fills, content: [] }) as unknown as PenpotNode;

const board = (name: string): PenpotNode =>
  ({ type: 'frame', name, fills: white, children: [] }) as unknown as PenpotNode;

const bool = (
  boolType: BoolOperations,
  children: PenpotNode[],
  attributes: Partial<BoolShape> = {}
): BoolShape =>
  ({
    type: 'bool',
    name: 'Bool',
    boolType,
    fills: black,
    children,
    ...attributes
  }) as BoolShape;

const addPathCall = (index: number): Record<string, unknown> => addPath.mock.calls[index][0];

describe('createBool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    colors.clear();
  });

  // Penpot discards the appearance set on the bool itself and inherits it from one
  // of the children instead: the first one for a difference, the last one for every
  // other operation.
  it('propagates the fills to the first child of a difference', () => {
    createBool(context, bool('difference', [path('first'), path('last', white)]));

    expect(addPathCall(0)).toMatchObject({ name: 'first', fills: black });
    // Only the inheriting child is touched, the rest keep their own fills.
    expect(addPathCall(1)).toMatchObject({ name: 'last', fills: white });
  });

  it.each<BoolOperations>(['union', 'intersection', 'exclude'])(
    'propagates the fills to the last child of a %s',
    boolType => {
      createBool(context, bool(boolType, [path('first', white), path('last')]));

      expect(addPathCall(0)).toMatchObject({ name: 'first', fills: white });
      expect(addPathCall(1)).toMatchObject({ name: 'last', fills: black });
    }
  );

  it('propagates the strokes and the fill style as well', () => {
    colors.set('style-id', { fills: white });

    createBool(
      context,
      bool('difference', [path('first')], { fills: [], fillStyleId: 'style-id', strokes })
    );

    expect(addPathCall(0)).toMatchObject({ fills: white, fillStyleId: 'style-id', strokes });
  });

  it('skips boards, which cannot take part in a boolean operation', () => {
    createBool(context, bool('union', [path('first'), board('board')]));

    expect(addBoard.mock.calls[0][0]).toMatchObject({ name: 'board', fills: white });
    expect(addPathCall(0)).toMatchObject({ name: 'first', fills: black });
  });

  it('keeps its own fills when there is no child to inherit them', () => {
    createBool(context, bool('union', []));

    expect(addGroup.mock.calls[0][0]).toMatchObject({ name: 'Bool', fills: black });
    expect(addPath).not.toHaveBeenCalled();
  });
});
