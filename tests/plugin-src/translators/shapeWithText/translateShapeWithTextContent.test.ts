import { beforeEach, describe, expect, it, vi } from 'vitest';

import { translateShapeWithTextContent } from '@plugin/translators/shapeWithText';

type Segment = StyledTextSegment;

const segment = (characters: string, fontWeight: number, fillStyleId = ''): Segment =>
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
    textStyleId: ''
  }) as Segment;

describe('translateShapeWithTextContent', () => {
  beforeEach(() => {
    // @ts-expect-error figma is mocked for tests
    global.figma = { mixed: Symbol('mixed') };
    vi.clearAllMocks();
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
