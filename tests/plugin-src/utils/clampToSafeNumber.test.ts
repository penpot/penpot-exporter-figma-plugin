import { describe, expect, it } from 'vitest';

import {
  PENPOT_SAFE_NUMBER_MAX,
  PENPOT_SAFE_NUMBER_MIN,
  clampToSafeNumber
} from '@plugin/utils/clampToSafeNumber';

describe('clampToSafeNumber', () => {
  it('deja pasar valores dentro del rango', () => {
    expect(clampToSafeNumber(0)).toBe(0);
    expect(clampToSafeNumber(0.5)).toBe(0.5);
    expect(clampToSafeNumber(-123.45)).toBe(-123.45);
    expect(clampToSafeNumber(PENPOT_SAFE_NUMBER_MAX)).toBe(PENPOT_SAFE_NUMBER_MAX);
    expect(clampToSafeNumber(PENPOT_SAFE_NUMBER_MIN)).toBe(PENPOT_SAFE_NUMBER_MIN);
  });

  it('recorta valores fuera del rango que Penpot acepta', () => {
    expect(clampToSafeNumber(1e12)).toBe(PENPOT_SAFE_NUMBER_MAX);
    expect(clampToSafeNumber(-1e12)).toBe(PENPOT_SAFE_NUMBER_MIN);
    expect(clampToSafeNumber(Infinity)).toBe(PENPOT_SAFE_NUMBER_MAX);
    expect(clampToSafeNumber(-Infinity)).toBe(PENPOT_SAFE_NUMBER_MIN);
  });

  it('convierte NaN en 0', () => {
    expect(clampToSafeNumber(NaN)).toBe(0);
  });
});
