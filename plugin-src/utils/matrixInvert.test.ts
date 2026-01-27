import { describe, expect, it } from 'vitest';

import { matrixInvert } from './matrixInvert';

describe('matrixInvert', () => {
  it('invierte matriz identidad correctamente', () => {
    const identity = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    const result = matrixInvert(identity);
    expect(result).toBeDefined();
    expect(result).toEqual(identity);
  });

  it('retorna undefined para matriz no cuadrada', () => {
    const nonSquare = [
      [1, 2, 3],
      [4, 5, 6]
    ];
    expect(matrixInvert(nonSquare)).toBeUndefined();
  });

  it('retorna undefined para matriz singular (no invertible)', () => {
    const singular = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    expect(matrixInvert(singular)).toBeUndefined();
  });

  it('verifica que A * A^-1 = I para matriz 3x3', () => {
    const A = [
      [1, 2, 3],
      [0, 1, 4],
      [5, 6, 0]
    ];
    const Ainv = matrixInvert(A);
    expect(Ainv).toBeDefined();

    if (Ainv) {
      // Multiplicar A * Ainv
      const result: number[][] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          for (let k = 0; k < 3; k++) {
            result[i][j] += A[i][k] * Ainv[k][j];
          }
        }
      }

      // Verificar que es aproximadamente la identidad
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const expected = i === j ? 1 : 0;
          expect(result[i][j]).toBeCloseTo(expected, 10);
        }
      }
    }
  });

  it('invierte matriz 2x2 correctamente', () => {
    const matrix = [
      [2, 1],
      [1, 1]
    ];
    const result = matrixInvert(matrix);
    expect(result).toBeDefined();
    expect(result).toEqual([
      [1, -1],
      [-1, 2]
    ]);
  });

  it('maneja matriz con ceros en diagonal (con swap)', () => {
    const matrix = [
      [0, 1],
      [1, 0]
    ];
    const result = matrixInvert(matrix);
    expect(result).toBeDefined();
    // La inversa de [[0,1],[1,0]] es [[0,1],[1,0]]
    expect(result).toEqual([
      [0, 1],
      [1, 0]
    ]);
  });

  it('retorna undefined para matriz con fila de ceros', () => {
    const matrix = [
      [1, 2, 3],
      [0, 0, 0],
      [4, 5, 6]
    ];
    expect(matrixInvert(matrix)).toBeUndefined();
  });
});
