import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { BoolShape } from '@ui/lib/types/shapes/boolShape';
import type { Fill } from '@ui/lib/types/utils/fill';
import type { Stroke } from '@ui/lib/types/utils/stroke';
import { createBool } from '@ui/parser/creators/createBool';
import type { PenpotNode } from '@ui/types';

vi.mock('@ui/parser', () => ({
  colors: new Map(),
  images: new Map()
}));

vi.mock('@ui/parser/creators', () => ({ createItems: vi.fn() }));

const boolFills = [{ fillColor: '#ff0000', fillOpacity: 1 }] as Fill[];
const boolStrokes = [{ strokeColor: '#00ff00', strokeWidth: 2 }] as Stroke[];

const node = (type: string, name: string): PenpotNode =>
  ({
    type,
    name,
    fills: [{ fillColor: '#000000', fillOpacity: 1 }],
    strokes: []
  }) as unknown as PenpotNode;

const createContext = (): PenpotContext =>
  ({
    addGroup: vi.fn(() => 'group-id'),
    closeGroup: vi.fn(),
    addBool: vi.fn()
  }) as unknown as PenpotContext;

const bool = (boolType: string, children: PenpotNode[]): BoolShape =>
  ({
    type: 'bool',
    name: 'bool',
    boolType,
    fills: boolFills,
    strokes: boolStrokes,
    children
  }) as unknown as BoolShape;

describe('createBool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gives the bool style to the last child for union', () => {
    const first = node('path', 'a');
    const last = node('path', 'b');

    createBool(createContext(), bool('union', [first, last]));

    expect(last).toMatchObject({ fills: boolFills, strokes: boolStrokes });
    expect(first.fills).not.toEqual(boolFills);
  });

  it('gives the bool style to the first child for difference', () => {
    const first = node('path', 'a');
    const last = node('path', 'b');

    createBool(createContext(), bool('difference', [first, last]));

    expect(first).toMatchObject({ fills: boolFills, strokes: boolStrokes });
    expect(last.fills).not.toEqual(boolFills);
  });

  it('skips frame children when choosing the head', () => {
    const firstFrame = node('frame', 'f1');
    const path = node('path', 'p');
    const lastFrame = node('frame', 'f2');

    createBool(createContext(), bool('difference', [firstFrame, path, lastFrame]));

    expect(path).toMatchObject({ fills: boolFills, strokes: boolStrokes });
    expect(firstFrame.fills).not.toEqual(boolFills);
    expect(lastFrame.fills).not.toEqual(boolFills);
  });
});
