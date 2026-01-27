import { describe, expect, it } from 'vitest';

import { calculateRadialGradient } from './calculateRadialGradient';

describe('calculateRadialGradient', () => {
  it('calcula gradiente radial con matriz identidad', () => {
    const identity: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateRadialGradient(identity);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    // Con identidad, el centro debería estar en [0.5, 0.5]
    expect(result.start[0]).toBeCloseTo(0.5, 5);
    expect(result.start[1]).toBeCloseTo(0.5, 5);
  });

  it('calcula gradiente radial con transformación 2x3', () => {
    const transform: Transform = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateRadialGradient(transform);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
  });

  it('calcula gradiente radial con transformación 3x3', () => {
    const transform = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ] as unknown as Transform;
    const result = calculateRadialGradient(transform);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
  });

  it('retorna valores por defecto para matriz no invertible', () => {
    const singular: Transform = [
      [0, 0, 0],
      [0, 0, 0]
    ];
    const result = calculateRadialGradient(singular);
    expect(result.start).toEqual([0, 0]);
    expect(result.end).toEqual([0, 0]);
  });

  it('calcula gradiente radial con escala uniforme', () => {
    const scale: Transform = [
      [2, 0, 0],
      [0, 2, 0]
    ];
    const result = calculateRadialGradient(scale);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    // El centro debería estar escalado
    expect(result.start[0]).toBeCloseTo(0.25, 5);
    expect(result.start[1]).toBeCloseTo(0.25, 5);
  });

  it('calcula gradiente radial con escala no uniforme', () => {
    const scale: Transform = [
      [2, 0, 0],
      [0, 1, 0]
    ];
    const result = calculateRadialGradient(scale);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    // Debería calcular radios diferentes para x e y
    expect(result.start[0]).toBeCloseTo(0.25, 5);
    expect(result.start[1]).toBeCloseTo(0.5, 5);
  });

  it('calcula gradiente radial con traslación', () => {
    const translation: Transform = [
      [1, 0, 10],
      [0, 1, 20]
    ];
    const result = calculateRadialGradient(translation);
    expect(result.start).toHaveLength(2);
    expect(result.end).toHaveLength(2);
    // El centro debería estar trasladado
    expect(result.start[0]).not.toBe(0.5);
    expect(result.start[1]).not.toBe(0.5);
  });
});
