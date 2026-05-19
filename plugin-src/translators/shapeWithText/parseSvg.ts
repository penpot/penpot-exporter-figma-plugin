// Regex-based SVG parsing — Figma's QuickJS worker has no DOMParser. Assumes
// Figma's export shape: flat (no nested <g>), double-quoted attrs, no CDATA.
import { multiplyMatrix } from '@plugin/utils';

export const stripSvgDefs = (svg: string): string =>
  svg.replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/gi, '');

export const parseSvgAttrs = (input: string): Record<string, string> => {
  const regex = /([\w-]+)\s*=\s*"([^"]*)"/g;
  const result: Record<string, string> = {};

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    result[match[1]] = match[2];
  }

  return result;
};

export const numAttr = (value: string | undefined, fallback = 0): number => {
  if (value === undefined) return fallback;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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
