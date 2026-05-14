import { beforeEach, describe, expect, it, vi } from 'vitest';

import { processSlides } from '@plugin/processors/processSlides';

vi.mock('@plugin/transformers', () => ({
  transformSceneNode: vi.fn(async (node: { id: string; name: string }) => ({
    type: 'frame',
    name: node.name,
    id: node.id
  }))
}));

vi.mock('@plugin/utils', () => ({
  reportProgress: vi.fn(),
  flushProgress: vi.fn()
}));

vi.mock('@common/sleep', () => ({
  yieldByTime: vi.fn(async () => {})
}));

type SlideLike = { id: string; name: string; type: 'SLIDE' };

const createSlide = (id: string, name: string): SlideLike =>
  ({
    id,
    name,
    type: 'SLIDE',
    children: [],
    visible: true,
    locked: false,
    absoluteTransform: [
      [1, 0, 0],
      [0, 1, 0]
    ]
  }) as unknown as SlideLike;

describe('processSlides', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('flattens the 2D slide grid into a single page', async () => {
    const slides = [
      [createSlide('1', 'Slide 1'), createSlide('2', 'Slide 2')],
      [createSlide('3', 'Slide 3'), createSlide('4', 'Slide 4')]
    ];

    // @ts-expect-error - Mocking global figma object
    global.figma = {
      getCanvasGrid: vi.fn(() => slides)
    };

    const root = { name: 'My deck', children: [] } as unknown as DocumentNode;

    const result = await processSlides(root);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('My deck');
    expect(result[0].children).toHaveLength(4);
    // Slides must be reversed so Penpot's layer panel and prototype playback
    // display them in the original Figma reading order.
    expect(result[0].children.map(c => c.name)).toEqual([
      'Slide 4',
      'Slide 3',
      'Slide 2',
      'Slide 1'
    ]);
  });

  it('returns an empty page when the slide grid is empty', async () => {
    // @ts-expect-error - Mocking global figma object
    global.figma = {
      getCanvasGrid: vi.fn(() => [])
    };

    const root = { name: 'Empty deck', children: [] } as unknown as DocumentNode;

    const result = await processSlides(root);

    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(0);
  });
});
