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

    expect(result).not.toBeNull();
    const [name, token] = result!;

    expect(name).toBe('elevation.small');
    expect(token.$type).toBe('shadow');
    expect(token.$description).toBe('Small shadow');
    expect(token.$value).toEqual([
      {
        color: 'rgba(0, 0, 0, 0.25)',
        x: '0',
        y: '4',
        blur: '8',
        spread: '0',
        inset: false
      }
    ]);
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

    expect(result).not.toBeNull();
    const [, token] = result!;

    expect(token.$value).toEqual([
      {
        color: 'rgba(255, 0, 0, 0.50)',
        x: '2',
        y: '2',
        blur: '4',
        spread: '1',
        inset: true
      }
    ]);
  });

  it('groups multi-shadow styles into a single token with array value', () => {
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
          type: 'INNER_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 0.2 },
          offset: { x: 0, y: 8 },
          radius: 16,
          spread: 0,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).not.toBeNull();
    const [name, token] = result!;

    expect(name).toBe('multi-shadow');
    expect(token.$type).toBe('shadow');
    expect(token.$value).toEqual([
      {
        color: 'rgba(0, 0, 0, 0.20)',
        x: '0',
        y: '8',
        blur: '16',
        spread: '0',
        inset: true
      },
      {
        color: 'rgba(0, 0, 0, 0.10)',
        x: '0',
        y: '2',
        blur: '4',
        spread: '0',
        inset: false
      }
    ]);
  });

  it('returns null when only blur effects exist', () => {
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

    expect(result).toBeNull();
  });

  it('returns null when no effects exist', () => {
    const style = {
      name: 'empty',
      description: '',
      effects: []
    } as unknown as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toBeNull();
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

    expect(result).not.toBeNull();
    const [, token] = result!;
    const [shadow] = token.$value as { color: string }[];

    expect(shadow.color).toBe('rgb(0, 0, 0)');
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

    expect(result).not.toBeNull();
    const [, token] = result!;
    const shadows = token.$value as { inset: boolean }[];

    expect(shadows).toHaveLength(1);
    expect(shadows[0].inset).toBe(false);
  });

  it('preserves reverse order after filtering non-shadow effects', () => {
    const style = {
      name: 'mixed-ordered',
      description: '',
      effects: [
        {
          type: 'LAYER_BLUR' as const,
          radius: 10,
          visible: true
        },
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
          color: { r: 0, g: 0, b: 0, a: 0.3 },
          offset: { x: 0, y: 6 },
          radius: 12,
          spread: 0,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).not.toBeNull();
    const [, token] = result!;
    const shadows = token.$value as { y: string }[];

    expect(shadows).toHaveLength(2);
    expect(shadows[0].y).toBe('6');
    expect(shadows[1].y).toBe('2');
  });

  it('skips invisible shadow effects', () => {
    const style = {
      name: 'mixed-visibility',
      description: '',
      effects: [
        {
          type: 'DROP_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 0.1 },
          offset: { x: 0, y: 2 },
          radius: 4,
          spread: 0,
          visible: false
        },
        {
          type: 'INNER_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 0.2 },
          offset: { x: 0, y: 8 },
          radius: 16,
          spread: 0,
          visible: true
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).not.toBeNull();
    const [, token] = result!;

    expect(token.$value).toEqual([
      {
        color: 'rgba(0, 0, 0, 0.20)',
        x: '0',
        y: '8',
        blur: '16',
        spread: '0',
        inset: true
      }
    ]);
  });

  it('returns null when all shadow effects are invisible', () => {
    const style = {
      name: 'hidden-shadows',
      description: '',
      effects: [
        {
          type: 'DROP_SHADOW' as const,
          color: { r: 0, g: 0, b: 0, a: 0.5 },
          offset: { x: 0, y: 4 },
          radius: 8,
          spread: 0,
          visible: false
        }
      ]
    } as EffectStyle;

    const result = translateEffectStyleToken(style);

    expect(result).toBeNull();
  });
});
