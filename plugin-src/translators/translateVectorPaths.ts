import SVGPathCommander from 'svg-path-commander';

import { Segment } from '@ui/lib/types/path/PathContent';

export const translateVectorPaths = (
  paths: VectorPaths,
  baseX: number,
  baseY: number
): Segment[] => {
  let segments: Segment[] = [];

  for (const path of paths) {
    segments = [...segments, ...translateVectorPath(path, baseX, baseY)];
  }

  return segments;
};

const translateVectorPath = (path: VectorPath, baseX: number, baseY: number): Segment[] => {
  const segments: Segment[] = [];

  const normalizedPath = SVGPathCommander.normalizePath(path.data);

  for (const [command, ...rest] of normalizedPath) {
    switch (command) {
      case 'M':
        segments.push({
          command: 'move-to',
          params: { x: (rest[0] ?? 0) + baseX, y: (rest[1] ?? 0) + baseY }
        });
        break;
      case 'L':
        segments.push({
          command: 'line-to',
          params: { x: (rest[0] ?? 0) + baseX, y: (rest[1] ?? 0) + baseY }
        });
        break;
      case 'C':
        segments.push({
          command: 'curve-to',
          params: {
            c1x: (rest[0] ?? 0) + baseX,
            c1y: (rest[1] ?? 0) + baseY,
            c2x: (rest[2] ?? 0) + baseX,
            c2y: (rest[3] ?? 0) + baseY,
            x: (rest[4] ?? 0) + baseX,
            y: (rest[5] ?? 0) + baseY
          }
        });
        break;
      case 'Z':
        segments.push({
          command: 'close-path'
        });
        break;
    }
  }

  return segments;
};
