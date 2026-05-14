import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllState } from '@plugin/libraries';
import { transformStickyNode } from '@plugin/transformers/transformStickyNode';

type StickyArg = Parameters<typeof transformStickyNode>[0];

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): Record<string, never> => ({}),
  transformDimension: (): { width: number; height: number } => ({
    width: 240,
    height: 240
  }),
  transformFills: (): { fills: never[] } => ({ fills: [] }),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'sticky-id',
    shapeRef: undefined
  }),
  transformRotationAndPosition: (): { x: number; y: number } => ({ x: 0, y: 0 }),
  transformSceneNode: (node: { locked?: boolean; visible: boolean }): Record<string, boolean> => ({
    blocked: Boolean(node.locked),
    hidden: !node.visible
  }),
  transformText: (): Record<string, never> => ({})
}));

const createSticky = (overrides: Partial<StickyArg> = {}): StickyArg => {
  return {
    id: '10:1',
    name: 'Sticky 1',
    type: 'STICKY',
    visible: true,
    locked: false,
    width: 240,
    height: 240,
    absoluteTransform: [
      [1, 0, 100],
      [0, 1, 200]
    ],
    text: {
      characters: 'Hello world',
      fontName: { family: 'Inter', style: 'Regular' },
      fills: []
    },
    authorVisible: false,
    authorName: '',
    isWideWidth: false,
    fills: [],
    opacity: 1,
    blendMode: 'NORMAL',
    ...overrides
  } as unknown as StickyArg;
};

describe('transformStickyNode', () => {
  beforeEach(() => {
    clearAllState();
    vi.clearAllMocks();
  });

  it('returns a Penpot frame with the sticky name', () => {
    const result = transformStickyNode(createSticky({ name: 'My note' } as Partial<StickyArg>));

    expect(result.type).toBe('frame');
    expect(result.name).toBe('My note');
  });

  it('falls back to "Sticky" when the sticky has no name', () => {
    const result = transformStickyNode(createSticky({ name: '' } as Partial<StickyArg>));

    expect(result.name).toBe('Sticky');
  });

  it('applies a subtle drop shadow', () => {
    const result = transformStickyNode(createSticky());

    expect(result.shadow).toBeDefined();
    expect(result.shadow?.length).toBe(1);
    expect(result.shadow?.[0]?.style).toBe('drop-shadow');
  });

  it('applies a small corner radius', () => {
    const result = transformStickyNode(createSticky());

    expect(result.r1).toBe(4);
    expect(result.r2).toBe(4);
    expect(result.r3).toBe(4);
    expect(result.r4).toBe(4);
  });

  it('emits a body text child even when the sticky is empty', () => {
    const result = transformStickyNode(
      createSticky({
        text: { characters: '', fontName: { family: 'Inter', style: 'Regular' }, fills: [] }
      } as unknown as Partial<StickyArg>)
    );

    expect(result.children).toBeDefined();
    expect(result.children?.length).toBe(1);
    expect(result.children?.[0]?.type).toBe('text');
  });

  it('insets the body text child by 24px from the sticky origin', () => {
    const result = transformStickyNode(createSticky());

    const text = result.children?.[0] as { x: number; y: number; width: number; height: number };
    expect(text.x).toBe(124); // 100 + padding
    expect(text.y).toBe(224); // 200 + padding
    expect(text.width).toBe(192); // 240 - 2*24
    expect(text.height).toBe(192); // no author reserved
  });

  it('emits an author text child when authorVisible and authorName are set', () => {
    const result = transformStickyNode(
      createSticky({
        authorVisible: true,
        authorName: 'Roger Vidal'
      } as Partial<StickyArg>)
    );

    expect(result.children?.length).toBe(2);
    const author = result.children?.[1] as {
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      characters: string;
    };
    expect(author.name).toBe('author');
    expect(author.characters).toBe('Roger Vidal');
    expect(author.x).toBe(124); // 100 + padding
    // bottom-aligned: 200 + 240 - padding - authorHeight = 200 + 240 - 24 - 20 = 396
    expect(author.y).toBe(396);
    expect(author.height).toBe(20);
  });

  it('reserves space for the author footer in the body text height', () => {
    const result = transformStickyNode(
      createSticky({
        authorVisible: true,
        authorName: 'Roger Vidal'
      } as Partial<StickyArg>)
    );

    const body = result.children?.[0] as { height: number };
    // 240 - 2*24 (padding) - 20 (author height) - 8 (gap) = 164
    expect(body.height).toBe(164);
  });

  it('skips the author footer when the sticky is too short', () => {
    const result = transformStickyNode(
      createSticky({
        height: 60,
        authorVisible: true,
        authorName: 'Roger Vidal'
      } as Partial<StickyArg>)
    );

    expect(result.children?.length).toBe(1);
  });

  it('skips the author footer when authorVisible is false', () => {
    const result = transformStickyNode(
      createSticky({
        authorVisible: false,
        authorName: 'Roger Vidal'
      } as Partial<StickyArg>)
    );

    expect(result.children?.length).toBe(1);
  });
});
