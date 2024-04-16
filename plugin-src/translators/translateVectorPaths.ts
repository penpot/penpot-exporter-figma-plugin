import SVGPathCommander from 'svg-path-commander';

import { Segment } from '@ui/lib/types/path/PathContent';

export const translateVectorPaths = (paths: VectorPaths): Segment[] => {
  let segments: Segment[] = [];

  for (const path of paths) {
    segments = [...segments, ...translateVectorPath(path)];
  }

  return segments;
};

const translateVectorPath = (path: VectorPath): Segment[] => {
  console.log(path);
  const segments: Segment[] = [];

  const normalizedPath = SVGPathCommander.normalizePath(path.data);

  for (const [command, ...rest] of normalizedPath) {
    switch (command) {
      case 'M':
        segments.push({
          command: 'move-to',
          params: { x: rest[0] ?? 0, y: rest[1] ?? 0 }
        });
        break;
      case 'L':
        segments.push({
          command: 'line-to',
          params: { x: rest[0] ?? 0, y: rest[1] ?? 0 }
        });
        break;
      case 'C':
        segments.push({
          command: 'curve-to',
          params: {
            x: rest[0] ?? 0,
            y: rest[1] ?? 0,
            c1x: rest[2] ?? 0,
            c1y: rest[3] ?? 0,
            c2x: rest[4] ?? 0,
            c2y: rest[5] ?? 0
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

  console.log(segments);

  return segments;
};
