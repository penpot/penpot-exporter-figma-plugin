import { describe, expect, it } from 'vitest';

import { translateConnectorStrokeCap } from '@plugin/translators/translateConnectorStrokeCap';

describe('translateConnectorStrokeCap', () => {
  it('returns undefined for NONE', () => {
    expect(translateConnectorStrokeCap('NONE')).toBeUndefined();
  });

  it('maps ARROW_EQUILATERAL and TRIANGLE_FILLED to triangle-arrow', () => {
    expect(translateConnectorStrokeCap('ARROW_EQUILATERAL')).toBe('triangle-arrow');
    expect(translateConnectorStrokeCap('TRIANGLE_FILLED')).toBe('triangle-arrow');
  });

  it('maps ARROW_LINES to line-arrow', () => {
    expect(translateConnectorStrokeCap('ARROW_LINES')).toBe('line-arrow');
  });

  it('maps DIAMOND_FILLED to diamond-marker', () => {
    expect(translateConnectorStrokeCap('DIAMOND_FILLED')).toBe('diamond-marker');
  });

  it('maps CIRCLE_FILLED to circle-marker', () => {
    expect(translateConnectorStrokeCap('CIRCLE_FILLED')).toBe('circle-marker');
  });

  it('falls back to line-arrow for ERD_* caps', () => {
    const erdCaps: ConnectorStrokeCap[] = [
      'ERD_ZERO_OR_ONE',
      'ERD_EXACTLY_ONE',
      'ERD_ZERO_OR_MORE',
      'ERD_ONE_OR_MORE',
      'ERD_ONE',
      'ERD_MANY'
    ];

    for (const cap of erdCaps) {
      expect(translateConnectorStrokeCap(cap)).toBe('line-arrow');
    }
  });
});
