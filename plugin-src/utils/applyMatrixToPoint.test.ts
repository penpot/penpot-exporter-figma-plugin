import { describe, expect, it } from 'vitest';

import { applyMatrixToPoint } from './applyMatrixToPoint';

describe('applyMatrixToPoint', () => {
  it('aplica matriz identidad sin cambios', () => {
    const identity = [
      [1, 0, 0],
      [0, 1, 0]
    ];
    const point = [5, 10];
    const result = applyMatrixToPoint(identity, point);
    expect(result).toEqual([5, 10]);
  });

  it('aplica traslación correctamente', () => {
    const translation = [
      [1, 0, 10],
      [0, 1, 20]
    ];
    const point = [5, 10];
    const result = applyMatrixToPoint(translation, point);
    expect(result).toEqual([15, 30]);
  });

  it('aplica escala correctamente', () => {
    const scale = [
      [2, 0, 0],
      [0, 3, 0]
    ];
    const point = [5, 10];
    const result = applyMatrixToPoint(scale, point);
    expect(result).toEqual([10, 30]);
  });

  it('aplica rotación de 90 grados', () => {
    // Rotación de 90 grados: cos(90) = 0, sin(90) = 1
    const rotation90 = [
      [0, -1, 0],
      [1, 0, 0]
    ];
    const point = [1, 0];
    const result = applyMatrixToPoint(rotation90, point);
    expect(result[0]).toBeCloseTo(0, 10);
    expect(result[1]).toBeCloseTo(1, 10);
  });

  it('aplica transformación combinada (escala + traslación)', () => {
    const transform = [
      [2, 0, 10],
      [0, 2, 20]
    ];
    const point = [5, 10];
    const result = applyMatrixToPoint(transform, point);
    // x = 5 * 2 + 10 = 20
    // y = 10 * 2 + 20 = 40
    expect(result).toEqual([20, 40]);
  });

  it('maneja punto en origen', () => {
    const matrix = [
      [2, 1, 5],
      [1, 2, 10]
    ];
    const point = [0, 0];
    const result = applyMatrixToPoint(matrix, point);
    expect(result).toEqual([5, 10]);
  });

  it('aplica transformación con valores negativos', () => {
    const matrix = [
      [-1, 0, 0],
      [0, -1, 0]
    ];
    const point = [5, 10];
    const result = applyMatrixToPoint(matrix, point);
    expect(result).toEqual([-5, -10]);
  });
});
