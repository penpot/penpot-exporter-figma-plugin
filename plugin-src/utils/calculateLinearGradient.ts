import { applyMatrixToPoint } from '@plugin/utils/applyMatrixToPoint';
import { clampToSafeNumber } from '@plugin/utils/clampToSafeNumber';
import { matrixInvert } from '@plugin/utils/matrixInvert';

export const calculateLinearGradient = (t: Transform): { start: number[]; end: number[] } => {
  const transform = t.length === 2 ? [...t, [0, 0, 1]] : [...t];
  const mxInv = matrixInvert(transform);

  if (!mxInv) {
    return {
      start: [0, 0],
      end: [0, 0]
    };
  }

  const startEnd = [
    [0, 0.5],
    [1, 0.5]
  ].map(p => applyMatrixToPoint(mxInv, p));

  return {
    start: [clampToSafeNumber(startEnd[0][0]), clampToSafeNumber(startEnd[0][1])],
    end: [clampToSafeNumber(startEnd[1][0]), clampToSafeNumber(startEnd[1][1])]
  };
};
