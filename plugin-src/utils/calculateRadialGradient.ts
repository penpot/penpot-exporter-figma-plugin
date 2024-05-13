import { applyMatrixToPoint } from '@plugin/utils/applyMatrixToPoint';
import { matrixInvert } from '@plugin/utils/matrixInvert';

export const calculateRadialGradient = (t: Transform): { start: number[]; end: number[] } => {
  const transform = t.length === 2 ? [...t, [0, 0, 1]] : [...t];
  const mxInv = matrixInvert(transform);

  if (!mxInv) {
    return {
      start: [0, 0],
      end: [0, 0]
    };
  }

  const centerPoint = applyMatrixToPoint(mxInv, [0.5, 0.5]);
  const rxPoint = applyMatrixToPoint(mxInv, [1, 0.5]);
  const ryPoint = applyMatrixToPoint(mxInv, [0.5, 1]);

  const rx = Math.sqrt(
    Math.pow(rxPoint[0] - centerPoint[0], 2) + Math.pow(rxPoint[1] - centerPoint[1], 2)
  );
  const ry = Math.sqrt(
    Math.pow(ryPoint[0] - centerPoint[0], 2) + Math.pow(ryPoint[1] - centerPoint[1], 2)
  );
  const angle =
    Math.atan((rxPoint[1] - centerPoint[1]) / (rxPoint[0] - centerPoint[0])) * (180 / Math.PI);

  return {
    start: centerPoint,
    end: calculateRadialGradientEndPoint(angle, centerPoint, [rx, ry])
  };
};

const calculateRadialGradientEndPoint = (
  rotation: number,
  center: number[],
  radius: number[]
): [number, number] => {
  const angle = rotation * (Math.PI / 180);
  const x = center[0] + radius[0] * Math.cos(angle);
  const y = center[1] + radius[1] * Math.sin(angle);
  return [x, y];
};
