export const applyMatrixToPoint = (matrix: number[][], point: number[]) => {
  return [
    point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2],
    point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2]
  ];
};
