import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { transformShapeWithTextNode } from '@plugin/transformers/transformShapeWithTextNode';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';
import type { TextShape } from '@ui/lib/types/shapes/textShape';

vi.mock('@plugin/transformers/partials', () => ({
  transformBlend: (): { opacity: number } => ({ opacity: 0.5 }),
  transformChildIds: (_node: unknown, index: number): { id: string; shapeRef: undefined } => ({
    id: `child-${index}`,
    shapeRef: undefined
  }),
  transformDimension: (): { width: number; height: number } => ({ width: 100, height: 50 }),
  transformFills: (): { fills: never[] } => ({ fills: [] }),
  transformIds: (): { id: string; shapeRef: undefined } => ({
    id: 'group-id',
    shapeRef: undefined
  }),
  transformOverrides: (): Record<string, never> => ({}),
  transformRotationAndPosition: (): { x: number; y: number } => ({ x: 10, y: 20 }),
  transformSceneNode: (): Record<string, never> => ({}),
  transformVariableConsumptionMap: (): Record<string, never> => ({})
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

// Default editable: one shape path.
// Default outlined: same shape path + one trailing text path (5x5 box at 1,1).
// Caller can override either independently.
const DEFAULT_EDITABLE = '<svg><path d="M 0 0 L 10 10 Z"/></svg>';
const DEFAULT_OUTLINED =
  '<svg><path d="M 0 0 L 10 10 Z"/><path d="M 1 1 L 6 1 L 6 6 L 1 6 Z"/></svg>';

const createShapeWithTextNode = (
  overrides: Partial<ShapeWithTextArg> & {
    svg?: string;
    outlinedSvg?: string;
    exportThrows?: boolean;
    outlineExportThrows?: boolean;
    characters?: string;
  } = {}
): ShapeWithTextArg => {
  const {
    svg,
    outlinedSvg,
    exportThrows,
    outlineExportThrows,
    characters = 'Hello',
    ...rest
  } = overrides;

  const exportAsync = vi.fn(async (opts: { svgOutlineText?: boolean }): Promise<string> => {
    if (opts.svgOutlineText === true) {
      if (outlineExportThrows) throw new Error('outline-boom');
      return outlinedSvg ?? DEFAULT_OUTLINED;
    }
    if (exportThrows) throw new Error('boom');
    return svg ?? DEFAULT_EDITABLE;
  });

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

  it('places the text shape using a padded frame centered on the glyph bbox', async () => {
    // aabb = (10, 20). geometry svgOrigin = (0, 0). Outlined text bbox (1..6, 1..6):
    // bbWidth=5, pad=max(1, 8)=8 → width=13; x = aabb.x + 1 - pad/2 = 7.
    const result = (await transformShapeWithTextNode(createShapeWithTextNode())) as GroupShape;
    const text = result.children?.[1] as TextShape;

    expect(text.x).toBe(7);
    expect(text.y).toBe(21);
    expect(text.width).toBe(13);
    expect(text.height).toBe(5);
  });

  it("applies the SVG element's transform and aligns the path bbox to AABB", async () => {
    const node = createShapeWithTextNode({
      svg: '<svg><path d="M 0 0 L 10 0 L 10 5 L 0 5 Z" transform="rotate(90)"/></svg>',
      outlinedSvg:
        '<svg><path d="M 0 0 L 10 0 L 10 5 L 0 5 Z" transform="rotate(90)"/><path d="M 0 0 L 1 1 Z"/></svg>',
      absoluteBoundingBox: { x: 100, y: 200, width: 10, height: 10 } as Rect
    });

    const result = (await transformShapeWithTextNode(node)) as GroupShape;
    const shape = result.children?.[0] as PathShape;

    expect(shape.content).toBe('M 105 200 L 105 210 L 100 210 L 100 200 Z');
  });

  it('concatenates multiple <path d="…"/> entries from the editable SVG', async () => {
    const node = createShapeWithTextNode({
      svg: '<svg><path d="M 0 0 L 5 5"/><path d="M 10 10 L 20 20"/></svg>',
      outlinedSvg:
        '<svg><path d="M 0 0 L 5 5"/><path d="M 10 10 L 20 20"/><path d="M 0 0 L 1 1"/></svg>'
    });

    const result = (await transformShapeWithTextNode(node)) as GroupShape;
    const shape = result.children?.[0] as PathShape;

    expect((shape.content.match(/M /g) ?? []).length).toBe(2);
  });

  it('omits the TextShape (and the outlined export) when text is empty', async () => {
    const node = createShapeWithTextNode({ characters: '' });
    const result = (await transformShapeWithTextNode(node)) as GroupShape;

    expect(result.children).toHaveLength(1);
    expect(node.exportAsync).toHaveBeenCalledTimes(1);
    expect(node.exportAsync).toHaveBeenCalledWith(
      expect.objectContaining({ svgOutlineText: false })
    );
  });

  it('still emits the PathShape when the outlined export fails (drops only the text child)', async () => {
    const result = (await transformShapeWithTextNode(
      createShapeWithTextNode({ outlineExportThrows: true })
    )) as GroupShape;

    expect(result.children).toHaveLength(1);
    expect((result.children?.[0] as PathShape).type).toBe('path');
  });

  it('omits the TextShape when outlined has no more drawables than editable', async () => {
    // Edge case: outlined export missing the text path. extractTextLayout
    // returns undefined → text child not emitted, but path child still goes out.
    const result = (await transformShapeWithTextNode(
      createShapeWithTextNode({
        outlinedSvg: '<svg><path d="M 0 0 L 10 10 Z"/></svg>'
      })
    )) as GroupShape;

    expect(result.children).toHaveLength(1);
  });

  it('parses a drop shadow filter from the editable SVG and applies it to the PathShape', async () => {
    const svg = [
      '<svg>',
      '<defs>',
      '<filter id="filter0_d_1_2" x="-2" y="0" width="60" height="40">',
      '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
      '<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>',
      '<feOffset dx="0" dy="4"/>',
      '<feGaussianBlur stdDeviation="2"/>',
      '<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>',
      '</filter>',
      '</defs>',
      '<path d="M 0 0 L 10 10 Z"/>',
      '</svg>'
    ].join('');

    const result = (await transformShapeWithTextNode(
      createShapeWithTextNode({ svg })
    )) as GroupShape;
    const [shape] = result.children as [PathShape];

    expect(shape.shadow).toBeDefined();
    expect(shape.shadow).toHaveLength(1);
    expect(shape.shadow?.[0].style).toBe('drop-shadow');
    expect(shape.shadow?.[0].offsetY).toBe(4);
    expect(shape.shadow?.[0].blur).toBe(2);
    expect(shape.shadow?.[0].color.opacity).toBeCloseTo(0.25);
  });

  it('leaves shadow undefined when the SVG has no <filter>', async () => {
    const result = (await transformShapeWithTextNode(createShapeWithTextNode())) as GroupShape;
    const [shape] = result.children as [PathShape];

    expect(shape.shadow).toBeUndefined();
  });

  it('falls back to a rasterized rect when no drawable element can be extracted', async () => {
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
      createShapeWithTextNode({ svg, outlinedSvg: svg })
    )) as GroupShape;
    const shape = result.children?.[0] as PathShape;

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
      createShapeWithTextNode({ svg, outlinedSvg: svg })
    )) as GroupShape;
    const shape = result.children?.[0] as PathShape;

    expect((shape.content.match(/M /g) ?? []).length).toBe(1);
    expect(shape.content).not.toContain('100');
  });

  it('falls back to a rasterized rect when editable SVG export fails', async () => {
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

  it('skips the glyph-bbox layout override when the node is rotated', async () => {
    // Rotated SWT must inherit dimensions from the node instead of the glyph
    // AABB; otherwise applying `transformRotationAndPosition` on top would
    // rotate the bbox a second time and misalign the label.
    const node = createShapeWithTextNode({ rotation: 45 } as Partial<ShapeWithTextArg>);
    const result = (await transformShapeWithTextNode(node)) as GroupShape;
    const text = result.children?.[1] as TextShape;

    expect(text).toBeDefined();
    expect(text.width).toBe(100);
    expect(text.height).toBe(50);
    expect(text.x).toBe(10);
    expect(text.y).toBe(20);
  });

  it('still emits the text child for rotated nodes when outlined export is missing', async () => {
    const node = createShapeWithTextNode({
      rotation: 30,
      outlinedSvg: '<svg><path d="M 0 0 L 10 10 Z"/></svg>'
    } as Partial<ShapeWithTextArg>);
    const result = (await transformShapeWithTextNode(node)) as GroupShape;

    expect(result.children).toHaveLength(2);
    expect((result.children?.[1] as TextShape).type).toBe('text');
  });

  it('issues both exports (editable + outlined) when the node has text', async () => {
    const node = createShapeWithTextNode();
    await transformShapeWithTextNode(node);

    expect(node.exportAsync).toHaveBeenCalledTimes(2);
    expect(node.exportAsync).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ format: 'SVG_STRING', svgOutlineText: false })
    );
    expect(node.exportAsync).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ format: 'SVG_STRING', svgOutlineText: true })
    );
  });
});
