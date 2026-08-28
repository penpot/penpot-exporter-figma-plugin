import { describe, expect, it } from 'vitest';

import { findInvalidColors } from '@ui/parser/findInvalidColors';
import type { PenpotDocument } from '@ui/types';

const createDocument = (overrides: Partial<PenpotDocument> = {}): PenpotDocument => {
  return {
    name: 'Color test',
    children: [],
    components: {},
    paintStyles: {},
    textStyles: {},
    componentProperties: {},
    externalLibraries: {},
    missingFonts: [],
    degradedLayers: [],
    isShared: false,
    ...overrides
  };
};

describe('findInvalidColors', () => {
  it('finds invalid shape fill and color token values', () => {
    const document = createDocument({
      children: [
        {
          name: 'Page',
          children: [
            {
              name: 'Card',
              type: 'rect',
              fills: [{ fillColor: '#12345g' }]
            }
          ]
        }
      ] as PenpotDocument['children'],
      tokens: {
        $metadata: { tokenSetOrder: ['Colors'], activeThemes: [], activeSets: ['Colors'] },
        $themes: [],
        Colors: {
          Accent: {
            $value: '#abcdeg',
            $type: 'color',
            $description: ''
          }
        }
      } as PenpotDocument['tokens']
    });

    const invalidColors = findInvalidColors(document);

    expect(invalidColors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Card.fillColor = #12345g'),
        expect.stringContaining('Accent.$value = #abcdeg')
      ])
    );
  });

  it('returns an empty array for valid shape and token colors', () => {
    const document = createDocument({
      children: [
        {
          name: 'Page',
          children: [
            {
              name: 'Card',
              type: 'rect',
              fills: [{ fillColor: '#abcdef' }],
              strokes: [{ strokeColor: '#ABCDEF' }]
            }
          ]
        }
      ] as PenpotDocument['children'],
      tokens: {
        $metadata: { tokenSetOrder: ['Colors'], activeThemes: [], activeSets: ['Colors'] },
        $themes: [],
        Colors: {
          Accent: {
            $value: 'rgba(12, 34, 56, 0.50)',
            $type: 'color',
            $description: ''
          }
        }
      } as PenpotDocument['tokens']
    });

    expect(findInvalidColors(document)).toEqual([]);
  });
});
