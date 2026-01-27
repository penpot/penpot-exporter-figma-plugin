import { describe, expect, it } from 'vitest';

import { calculateLinearGradient } from './calculateLinearGradient';

describe('calculateLinearGradient', () => {
  it('calcula gradiente lineal con matriz identidad', () => {
    const identity: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateLinearGradient(identity);
    expect(result.start).toEqual([0, 0.5]);
    expect(result.end).toEqual([1, 0.5]);
  });

  it('calcula gradiente lineal con transformación 2x3', () => {
    const transform: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateLinearGradient(transform);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
  });

  it('calcula gradiente lineal con transformación 3x3', () => {
    const transform = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ] as unknown as Transform;
    const result = calculateLinearGradient(transform);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
  });

  it('retorna valores por defecto para matriz no invertible', () => {
    const singular: Transform = [
      [0, 0, 0],
      [0, 0, 0]
    ];
    const result = calculateLinearGradient(singular);
    expect(result.start).toEqual([0, 0]);
    expect(result.end).toEqual([0, 0]);
  });

  it('calcula gradiente con rotación', () => {
    // Rotación de 90 grados
    const rotation90: Transform = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    const result = calculateLinearGradient(rotation90);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    // Con rotación de 90°, aplicando la inversa a [0, 0.5] da [0.5, 0]
    expect(result.start[0]).toBeCloseTo(0.5, 5);
    expect(result.start[1]).toBeCloseTo(0, 5);
    // Y aplicando la inversa a [1, 0.5] da [0.5, -1]
    expect(result.end[0]).toBeCloseTo(0.5, 5);
    expect(result.end[1]).toBeCloseTo(-1, 5);
  });

  it('calcula gradiente con escala', () => {
    const scale: Transform = [
      [2, 0, 0],
      [0, 2, 0]
    ];
    const result = calculateLinearGradient(scale);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    // Con escala 2x, el gradiente debería estar escalado
    expect(result.end[0]).toBeGreaterThan(result.start[0]);
  });
});
