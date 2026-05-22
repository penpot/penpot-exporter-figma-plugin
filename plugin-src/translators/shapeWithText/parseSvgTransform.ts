import { multiplyMatrix } from '@plugin/utils';

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

const rotation = (degrees: number, cx = 0, cy = 0): Transform => {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [
    [cos, -sin, cx - cos * cx + sin * cy],
    [sin, cos, cy - sin * cx - cos * cy]
  ];
};

export const parseSvgTransform = (input: string | undefined): Transform => {
  if (!input) return identity();

  const regex = /(matrix|translate|rotate|scale)\s*\(([^)]+)\)/gi;
  let result: Transform = identity();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
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

    result = multiplyMatrix(result, local);
  }

  return result;
};
