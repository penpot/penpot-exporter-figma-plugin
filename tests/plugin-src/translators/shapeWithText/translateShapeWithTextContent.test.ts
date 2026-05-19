import { beforeEach, describe, expect, it, vi } from 'vitest';

import { translateShapeWithTextContent } from '@plugin/translators/shapeWithText';

type Segment = StyledTextSegment;

const segment = (
  characters: string,
  fontWeight: number,
  fillStyleId = '',
  overrides: Partial<Segment> = {}
): Segment =>
  ({
    characters,
    start: 0,
    end: characters.length,
    fontName: { family: 'Inter', style: fontWeight === 700 ? 'Bold' : 'Regular' },
    fontSize: 16,
    fontWeight,
    lineHeight: { unit: 'PIXELS', value: 20 },
    letterSpacing: { unit: 'PIXELS', value: 0 },
    textCase: 'ORIGINAL',
    textDecoration: 'NONE',
    indentation: 0,
    listOptions: { type: 'NONE' },
    fills: [],
    fillStyleId,
    textStyleId: '',
    ...overrides
  }) as Segment;

describe('translateShapeWithTextContent', () => {
  beforeEach(() => {
    // @ts-expect-error figma is mocked for tests
    global.figma = { mixed: Symbol('mixed') };
    vi.clearAllMocks();
  });

  it('does not stack paragraphSpacing on top of source \\n\\n breaks', () => {
    const characters = 'First.\n\nSecond.';
    const node = {
      text: {
        characters,
        fills: [],
        fillStyleId: '',
        paragraphIndent: 0,
        paragraphSpacing: 12,
        listSpacing: 0,
        getStyledTextSegments: (): Segment[] => [segment(characters, 400)]
      }
    } as ShapeWithTextNode;

    const result = translateShapeWithTextContent(node, []);
    const paragraph = result.content?.children?.[0].children[0];

    expect(paragraph?.children.map(child => child.text)).toEqual(['First.', '\n', '\n', 'Second.']);
  });

  it('emits textDecoration even when Figma reports an internal textStyleId', () => {
    const node = {
      text: {
        characters: 'Strikethrough',
        fills: [],
        fillStyleId: '',
        paragraphIndent: 0,
        paragraphSpacing: 0,
        listSpacing: 0,
        getStyledTextSegments: (): Segment[] => [
          segment('Strikethrough', 400, '', {
            textDecoration: 'STRIKETHROUGH',
            textStyleId: 'S:internal-default'
          })
        ]
      }
    } as ShapeWithTextNode;

    const result = translateShapeWithTextContent(node, []);
    const textNode = result.content?.children?.[0].children[0].children[0];

    expect(textNode?.textDecoration).toBe('line-through');
    expect(textNode?.textStyleId).toBeUndefined();
  });

  it('normalizes U+2028 / U+2029 to \\n so they split into separate text nodes', () => {
    const characters = 'A\u2028B\u2029C';
    const node = {
      text: {
        characters,
        fills: [],
        fillStyleId: '',
        paragraphIndent: 0,
        paragraphSpacing: 0,
        listSpacing: 0,
        getStyledTextSegments: (): Segment[] => [segment(characters, 400)]
      }
    } as ShapeWithTextNode;

    const result = translateShapeWithTextContent(node, []);
    const paragraph = result.content?.children?.[0].children[0];

    expect(result.characters).toBe('A\nB\nC');
    expect(paragraph?.children.map(child => child.text)).toEqual(['A', '\n', 'B', '\n', 'C']);
  });

  it('keeps segment styles when forced lines split the text', () => {
    const node = {
      text: {
        characters: 'HelloWorld',
        fills: [],
        fillStyleId: '',
        paragraphIndent: 0,
        paragraphSpacing: 0,
        listSpacing: 0,
        getStyledTextSegments: (): Segment[] => [segment('Hello', 400), segment('World', 700)]
      }
    } as ShapeWithTextNode;

    const result = translateShapeWithTextContent(node, ['Hello', 'World']);
    const paragraph = result.content?.children?.[0].children[0];

    expect(result.characters).toBe('Hello\nWorld');
    expect(paragraph?.children.map(child => child.text)).toEqual(['Hello', '\n', 'World']);
    expect(paragraph?.children[0].fontWeight).toBe('400');
    expect(paragraph?.children[2].fontWeight).toBe('700');
  });
});
