import { describe, expect, it, vi } from 'vitest';

import { buildTextContent } from '@plugin/translators/text/buildTextContent';
import type { TextSegment } from '@plugin/translators/text/paragraph';

vi.mock('@plugin/transformers/partials', () => ({
  transformFills: (): { fills: never[] } => ({ fills: [] })
}));

vi.mock('@plugin/translators/text', () => ({
  transformTextStyle: (): Record<string, never> => ({}),
  translateTextSegments: (): { text: string }[] => [{ text: 'Hello' }]
}));

const node = { fills: [] } as unknown as Parameters<typeof buildTextContent>[0];

describe('buildTextContent', () => {
  it('emits a root > paragraph-set > paragraph > text tree when there are no segments', () => {
    expect(buildTextContent(node, [], 'left', 'top')).toEqual({
      type: 'root',
      verticalAlign: 'top',
      children: [
        {
          type: 'paragraph-set',
          children: [{ type: 'paragraph', children: [{ text: '', fills: [] }] }]
        }
      ]
    });
  });

  it('keeps building paragraphs from the segments when there are some', () => {
    const segments = [{ characters: 'Hello' }] as unknown as TextSegment[];

    expect(buildTextContent(node, segments, 'left', 'top')).toEqual({
      type: 'root',
      verticalAlign: 'top',
      children: [
        {
          type: 'paragraph-set',
          children: [{ type: 'paragraph', children: [{ text: 'Hello' }], fills: [] }]
        }
      ]
    });
  });
});
