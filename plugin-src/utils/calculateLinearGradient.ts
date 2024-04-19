import { applyMatrixToPoint } from '@plugin/utils/applyMatrixToPoint';
import { matrixInvert } from '@plugin/utils/matrixInvert';

export const calculateLinearGradient = (shapeWidth: number, shapeHeight: number, t: Transform) => {
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
    start: [startEnd[0][0] * shapeWidth, startEnd[0][1] * shapeHeight],
    end: [startEnd[1][0] * shapeWidth, startEnd[1][1] * shapeHeight]
  };
};
