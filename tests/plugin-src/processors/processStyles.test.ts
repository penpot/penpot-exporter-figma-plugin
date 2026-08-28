import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { degradedLayers, paintStyles, textStyles } from '@plugin/libraries';
import { processPaintStyles } from '@plugin/processors/processPaintStyles';
import { processTextStyles } from '@plugin/processors/processTextStyles';
import { resetFigmaPlatformCorruption } from '@plugin/utils';

const { mockTranslatePaintStyle, mockTranslateTextStyle } = vi.hoisted(() => ({
  mockTranslatePaintStyle: vi.fn(),
  mockTranslateTextStyle: vi.fn()
}));

vi.mock('@common/sleep', () => ({
  yieldByTime: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('@plugin/translators/styles', () => ({
  translatePaintStyle: mockTranslatePaintStyle,
  translateTextStyle: mockTranslateTextStyle
}));

(globalThis as { figma?: typeof figma }).figma = {
  getStyleByIdAsync: vi.fn(),
  ui: { postMessage: vi.fn() }
} as unknown as typeof figma;

describe('style processing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    degradedLayers.clear();
    paintStyles.clear();
    textStyles.clear();
    resetFigmaPlatformCorruption();
  });

  afterEach(() => {
    degradedLayers.clear();
    paintStyles.clear();
    textStyles.clear();
    resetFigmaPlatformCorruption();
  });

  it('skips a paint style affected by a Figma platform error and processes the remaining styles', async () => {
    paintStyles.set('broken-paint', {
      id: 'broken-paint',
      name: 'Broken paint',
      type: 'PAINT'
    } as PaintStyle);
    paintStyles.set('working-paint', {
      id: 'working-paint',
      name: 'Working paint',
      type: 'PAINT'
    } as PaintStyle);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    mockTranslatePaintStyle.mockImplementationOnce(() => {
      throw new Error('in <unknown>: Attempted to invoke callback with invalid id -32408');
    });
    mockTranslatePaintStyle.mockReturnValueOnce({ name: 'Working paint', fills: [], colors: [] });

    await expect(processPaintStyles(1)).resolves.toEqual({
      'working-paint': { name: 'Working paint', fills: [], colors: [] }
    });
    expect(degradedLayers.get('broken-paint')).toBe(
      'Broken paint: style skipped due to a Figma platform error'
    );

    consoleWarnSpy.mockRestore();
  });

  it('skips a text style affected by a Figma platform error and processes the remaining styles', async () => {
    textStyles.set('broken-text', {
      id: 'broken-text',
      name: 'Broken text',
      type: 'TEXT'
    } as TextStyle);
    textStyles.set('working-text', {
      id: 'working-text',
      name: 'Working text',
      type: 'TEXT'
    } as TextStyle);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    mockTranslateTextStyle.mockImplementationOnce(() => {
      throw new Error('in <unknown>: Attempted to invoke callback with invalid id -32408');
    });
    mockTranslateTextStyle.mockReturnValueOnce({ name: 'Working text' });

    await expect(processTextStyles(1)).resolves.toEqual({
      'working-text': { name: 'Working text' }
    });
    expect(degradedLayers.get('broken-text')).toBe(
      'Broken text: style skipped due to a Figma platform error'
    );

    consoleWarnSpy.mockRestore();
  });
});
