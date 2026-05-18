import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { transformShapeWithTextNode } from '@plugin/transformers/transformShapeWithTextNode';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): { opacity: number } => ({ opacity: 0.5 }),
  transformDimension: (): { width: number; height: number } => ({ width: 100, height: 50 }),
  transformFills: (): { fills: never[] } => ({ fills: [] }),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'group-id',
    shapeRef: undefined
  }),
  transformOverrides: (): Record<string, never> => ({}),
  transformRotationAndPosition: (): { x: number; y: number } => ({ x: 10, y: 20 }),
  transformSceneNode: (): Record<string, never> => ({}),
  transformVariableConsumptionMap: (): Record<string, never> => ({}),
  transformVectorIds: (_node: unknown, index: number): { id: string; shapeRef: undefined } => ({
    id: `child-${index}`,
    shapeRef: undefined
  })
}));

vi.mock('@plugin/transformers', () => ({
  transformGroupNodeLike: (): { type: 'group'; name: string } => ({
    type: 'group',
    name: 'fake group'
  })
}));

const { transformNodeAsImageRect } = vi.hoisted(() => ({
  transformNodeAsImageRect: vi.fn(
    async (): Promise<RectShape | undefined> =>
      ({
        type: 'rect',
        name: 'fallback rect',
        id: 'fallback-id',
        fills: []
      }) as unknown as RectShape
  )
}));

vi.mock('@plugin/transformers/transformNodeAsImageRect', () => ({
  transformNodeAsImageRect
}));

vi.mock('@plugin/translators', () => ({
  translateStrokes: (): never[] => []
}));

vi.mock('@plugin/translators/shapeWithText/translateShapeWithTextContent', () => ({
  translateShapeWithTextContent: (
    node: ShapeWithTextNode
  ): {
    characters: string;
    content: { type: 'root'; verticalAlign: 'center' };
    growType: 'fixed';
  } => ({
    characters: node.text.characters,
    content: { type: 'root', verticalAlign: 'center' },
    growType: 'fixed'
  })
}));

type ShapeWithTextArg = Parameters<typeof transformShapeWithTextNode>[0];

const createShapeWithTextNode = (
  overrides: Partial<ShapeWithTextArg> & {
    svg?: string;
    exportThrows?: boolean;
    characters?: string;
  } = {}
): ShapeWithTextArg => {
  const { svg, exportThrows, characters = 'Hello', ...rest } = overrides;
  const exportAsync = exportThrows
    ? vi.fn().mockRejectedValue(new Error('boom'))
    : vi.fn().mockResolvedValue(svg ?? '<svg><path d="M 0 0 L 10 10 Z"/></svg>');

  return {
    id: '7:1',
    name: 'shape with text',
    type: 'SHAPE_WITH_TEXT',
    shapeType: 'DIAMOND',
    visible: true,
    locked: false,
    absoluteBoundingBox: { x: 10, y: 20, width: 100, height: 50 },
    text: { characters, getStyledTextSegments: () => [] },
    exportAsync,
    ...rest
  } as unknown as ShapeWithTextArg;
};

describe('transformShapeWithTextNode', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a GroupShape wrapping a PathShape and a TextShape', async () => {
    const result = (await transformShapeWithTextNode(createShapeWithTextNode())) as GroupShape;

    expect(result).toBeDefined();
    expect(result.type).toBe('group');
    expect(result.children).toHaveLength(2);

    const [shape, text] = result.children as [PathShape, TextShape];
    expect(shape.type).toBe('path');
    expect(shape.content).toBe('M 10 20 L 20 30 Z');
    expect(shape.opacity).toBeUndefined();
    expect(text.type).toBe('text');
    expect(text.characters).toBe('Hello');
    expect(text.opacity).toBeUndefined();
    expect(result.opacity).toBe(0.5);
  });

  it("applies the SVG element's transform and the AABB offset to path coords", async () => {
    // 90° rotation via element-level transform, then translate by AABB origin (100, 200).
    const node = createShapeWithTextNode({
      svg: '<svg><path d="M 0 0 L 10 0 L 10 5 L 0 5 Z" transform="rotate(90)"/></svg>',
      absoluteBoundingBox: { x: 100, y: 200, width: 10, height: 10 } as Rect
    });

    const result = (await transformShapeWithTextNode(node)) as GroupShape;
    const shape = result.children?.[0] as PathShape;

    expect(shape.content).toBe('M 100 200 L 100 210 L 95 210 L 95 200 Z');
  });

  it('concatenates multiple <path d="…"/> entries from the SVG', async () => {
    const node = createShapeWithTextNode({
      svg: '<svg><path d="M 0 0 L 5 5"/><path d="M 10 10 L 20 20"/></svg>'
    });

    const result = (await transformShapeWithTextNode(node)) as GroupShape;
    const shape = result.children?.[0] as PathShape;

    expect((shape.content.match(/M /g) ?? []).length).toBe(2);
  });

  it('still emits a TextShape when the embedded text is empty', async () => {
    const result = (await transformShapeWithTextNode(
      createShapeWithTextNode({ characters: '' })
    )) as GroupShape;

    const [, text] = result.children as [PathShape, TextShape];
    expect(text.type).toBe('text');
    expect(text.characters).toBe('');
  });

  it('falls back to a rasterized rect when no drawable element can be extracted from the SVG', async () => {
    const result = await transformShapeWithTextNode(
      createShapeWithTextNode({ svg: '<svg><text>only text</text></svg>' })
    );

    expect(result).toEqual(
      expect.objectContaining({
        type: 'rect',
        id: 'fallback-id'
      })
    );
    expect(transformNodeAsImageRect).toHaveBeenCalled();
  });

  it('converts <rect>, <circle>, <ellipse>, <polygon> into commands', async () => {
    const svg = [
      '<svg>',
      '<rect x="0" y="0" width="10" height="10"/>',
      '<circle cx="5" cy="5" r="5"/>',
      '<ellipse cx="5" cy="5" rx="5" ry="3"/>',
      '<polygon points="0,0 10,0 5,10"/>',
      '</svg>'
    ].join('');

    const result = (await transformShapeWithTextNode(
      createShapeWithTextNode({ svg })
    )) as GroupShape;
    const shape = result.children?.[0] as PathShape;

    // 4 subpaths, each starting with M
    expect((shape.content.match(/M /g) ?? []).length).toBe(4);
    expect(shape.content).toContain('Z');
    expect(shape.content).toContain('C ');
  });

  it('ignores paths inside <defs> (clipPath / mask geometry)', async () => {
    const svg = [
      '<svg>',
      '<path d="M 0 0 L 10 10 Z"/>',
      '<defs><clipPath id="c"><path d="M 0 0 L 100 100 Z"/></clipPath></defs>',
      '</svg>'
    ].join('');

    const result = (await transformShapeWithTextNode(
      createShapeWithTextNode({ svg })
    )) as GroupShape;
    const shape = result.children?.[0] as PathShape;

    // Only the visible path; the clipPath path inside <defs> is dropped.
    expect((shape.content.match(/M /g) ?? []).length).toBe(1);
    expect(shape.content).not.toContain('100');
  });

  it('falls back to a rasterized rect when SVG export fails', async () => {
    const result = await transformShapeWithTextNode(
      createShapeWithTextNode({ exportThrows: true })
    );

    expect(result).toEqual(
      expect.objectContaining({
        type: 'rect',
        id: 'fallback-id'
      })
    );
    expect(transformNodeAsImageRect).toHaveBeenCalled();
  });

  it('exports SVG as a string with text kept as <text> elements', async () => {
    const node = createShapeWithTextNode();
    await transformShapeWithTextNode(node);

    expect(node.exportAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        format: 'SVG_STRING',
        svgOutlineText: false
      })
    );
  });
});
