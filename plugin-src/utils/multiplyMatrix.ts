// 2x3 affine matrix multiplication. The result transforms a point as if `b` is
// applied first and then `a`: result * p === a * (b * p).
export const multiplyMatrix = (a: Transform, b: Transform): Transform => [
  [
    a[0][0] * b[0][0] + a[0][1] * b[1][0],
    a[0][0] * b[0][1] + a[0][1] * b[1][1],
    a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2]
  ],
  [
    a[1][0] * b[0][0] + a[1][1] * b[1][0],
    a[1][0] * b[0][1] + a[1][1] * b[1][1],
    a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2]
  ]
];
