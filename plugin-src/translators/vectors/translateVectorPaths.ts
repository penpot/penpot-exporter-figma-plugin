import { parseSVG } from 'svg-path-parser';

import { Segment } from '@ui/lib/types/shapes/pathShape';

import { translateCommandsToSegments } from '.';

export const translateVectorPaths = (
  paths: VectorPaths,
  baseX: number,
  baseY: number
): Segment[] => {
  const segments: Segment[] = [];

  for (const path of paths) {
    segments.push(...translateCommandsToSegments(parseSVG(path.data), baseX, baseY));
  }

  return segments;
};
