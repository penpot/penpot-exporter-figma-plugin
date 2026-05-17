// Parses an SVG `transform="..."` attribute into Figma's 2x3 affine `Transform`
// shape: [[a, c, e], [b, d, f]]. Supports the transform functions Figma's SVG
// export emits: matrix(), translate(), rotate(angle [cx cy]), scale().

const TRANSFORM_FN_REGEX = /(matrix|translate|rotate|scale)\s*\(([^)]+)\)/gi;

const identity = (): Transform => [
  [1, 0, 0],
  [0, 1, 0]
];

const parseArgs = (input: string): number[] =>
  input
    .trim()
    .split(/[\s,]+/)
    .map(parseFloat)
    .filter(n => Number.isFinite(n));

export const multiply = (a: Transform, b: Transform): Transform => [
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

const rotation = (degrees: number, cx = 0, cy = 0): Transform => {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  // translate(cx, cy) * rotate(angle) * translate(-cx, -cy)
  return [
    [cos, -sin, cx - cos * cx + sin * cy],
    [sin, cos, cy - sin * cx - cos * cy]
  ];
};

export const parseSvgTransform = (input: string | undefined): Transform => {
  if (!input) return identity();

  let result: Transform = identity();
  TRANSFORM_FN_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = TRANSFORM_FN_REGEX.exec(input)) !== null) {
    const fn = match[1].toLowerCase();
    const args = parseArgs(match[2]);
    let local: Transform = identity();

    switch (fn) {
      case 'matrix':
        if (args.length === 6) {
          local = [
            [args[0], args[2], args[4]],
            [args[1], args[3], args[5]]
          ];
        }
        break;
      case 'translate':
        local = [
          [1, 0, args[0] ?? 0],
          [0, 1, args[1] ?? 0]
        ];
        break;
      case 'rotate':
        local = rotation(args[0] ?? 0, args[1] ?? 0, args[2] ?? 0);
        break;
      case 'scale': {
        const sx = args[0] ?? 1;
        const sy = args[1] ?? sx;
        local = [
          [sx, 0, 0],
          [0, sy, 0]
        ];
        break;
      }
    }

    result = multiply(result, local);
  }

  return result;
};
