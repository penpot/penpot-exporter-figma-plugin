import { beforeEach, describe, expect, it } from 'vitest';

import { uniqueVariableNames } from '@plugin/libraries';
import { translateEffectStyleToken } from '@plugin/translators/tokens/translateEffectStyleToken';

describe('translateEffectStyleToken', () => {
  beforeEach(() => {
    uniqueVariableNames.clear();
  });

  it('converts DROP_SHADOW to shadow token', () => {
    const style = {
      name: 'elevation/small',
      description: 'Small shadow',
      effects: [
        {
          type: 'DROP_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 0.25 },
          offset: { x: 0, y: 4 },
          radius: 8,
          spread: 0,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toHaveLength(1);
    const [name, token] = result[0];

    expect(name).toBe('elevation.small');
    expect(token.$type).toBe('shadow');
    expect(token.$description).toBe('Small shadow');
    expect(token.$value).toEqual({
      color: 'rgba(0, 0, 0, 0.25)',
      x: 0,
      y: 4,
      blur: 8,
      spread: 0,
      type: 'drop'
    });
  });

  it('converts INNER_SHADOW to inset shadow token', () => {
    const style = {
      name: 'inset-shadow',
      description: '',
      effects: [
        {
          type: 'INNER_SHADOW' as const,
          color: { r: 1, g: 0, b: 0, a: 0.5 },
          offset: { x: 2, y: 2 },
          radius: 4,
          spread: 1,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toHaveLength(1);
    const [, token] = result[0];

    expect(token.$value).toEqual({
      color: 'rgba(255, 0, 0, 0.50)',
      x: 2,
      y: 2,
      blur: 4,
      spread: 1,
      type: 'inset'
    });
  });

  it('produces separate tokens for multi-shadow styles', () => {
    const style = {
      name: 'multi-shadow',
      description: '',
      effects: [
        {
          type: 'DROP_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 0.1 },
          offset: { x: 0, y: 2 },
          radius: 4,
          spread: 0,
          visible: true
        },
        {
          type: 'DROP_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 0.2 },
          offset: { x: 0, y: 8 },
          radius: 16,
          spread: 0,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe('multi-shadow');
    expect(result[1][0]).toBe('multi-shadow-1');
    expect(result[0][1].$type).toBe('shadow');
    expect(result[1][1].$type).toBe('shadow');
  });

  it('returns empty array when only blur effects exist', () => {
    const style = {
      name: 'blur-only',
      description: '',
      effects: [
        {
          type: 'LAYER_BLUR' as const,
          radius: 10,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toHaveLength(0);
  });

  it('returns empty array when no effects exist', () => {
    const style = {
      name: 'empty',
      description: '',
      effects: []
    } as unknown as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toHaveLength(0);
  });

  it('handles color with full alpha (a=1)', () => {
    const style = {
      name: 'opaque-shadow',
      description: '',
      effects: [
        {
          type: 'DROP_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 1 },
          offset: { x: 0, y: 4 },
          radius: 8,
          spread: 0,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toHaveLength(1);
    const [, token] = result[0];
    const value = token.$value as { color: string };

    expect(value.color).toBe('rgb(0, 0, 0)');
  });

  it('filters out non-shadow effects from mixed list', () => {
    const style = {
      name: 'mixed-effects',
      description: '',
      effects: [
        {
          type: 'LAYER_BLUR' as const,
          radius: 10,
          visible: true
        },
        {
          type: 'DROP_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 0.5 },
          offset: { x: 0, y: 4 },
          radius: 8,
          spread: 0,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toHaveLength(1);
    const [, token] = result[0];
    const value = token.$value as { type: string };

    expect(value.type).toBe('drop');
  });
});
