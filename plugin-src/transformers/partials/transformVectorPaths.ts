import {
  transformBlend,
  transformDimensionAndPositionFromVectorPath,
  transformEffects,
  transformProportion,
  transformSceneNode
} from '@plugin/transformers/partials';
import {
  createLineGeometry,
  translateStrokeCap,
  translateStrokes,
  translateVectorPath,
  translateVectorPaths
} from '@plugin/translators';
import { translateFills } from '@plugin/translators/fills';

import { PathAttributes } from '@ui/lib/types/shapes/pathShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { Children } from '@ui/lib/types/utils/children';
import { Stroke } from '@ui/lib/types/utils/stroke';

const getVectorPaths = (node: VectorNode | StarNode | LineNode | PolygonNode): VectorPaths => {
  switch (node.type) {
    case 'STAR':
    case 'POLYGON':
      return node.fillGeometry;
    case 'VECTOR':
      return node.vectorPaths;
    case 'LINE':
      return createLineGeometry(node);
  }
};

export const transformVectorPathsAsContent = (
  node: VectorNode | StarNode | LineNode | PolygonNode,
  baseX: number,
  baseY: number
): PathAttributes => {
  const vectorPaths = getVectorPaths(node);

  return {
    content: translateVectorPaths(vectorPaths, baseX + node.x, baseY + node.y)
  };
};

export const transformVectorPathsAsChildren = async (
  node: VectorNode,
  baseX: number,
  baseY: number
): Promise<Children> => {
  const regions = splitVectorNetwork(node.vectorNetwork);

  return {
    children: await Promise.all(
      regions.map(region => {
        return transformVectorPath(node, region, baseX, baseY);
      })
    )
  };
};

const transformVectorPath = async (
  node: VectorNode,
  region: Region,
  baseX: number,
  baseY: number
): Promise<PathShape> => {
  const vectorPath = createSVGPathData(node.vectorNetwork, region);

  return {
    type: 'path',
    name: 'svg-path',
    content: translateVectorPath(vectorPath, baseX + node.x, baseY + node.y),
    fills: await translateFills(region.region?.fills ?? node.fills),
    ...(await foo(node, region)),
    ...transformEffects(node),
    ...transformDimensionAndPositionFromVectorPath(vectorPath, baseX, baseY),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node)
  };
};

const foo = async (node: VectorNode, region: Region) => {
  return {
    strokes: await translateStrokes(node, (stroke: Stroke) => {
      if (region.region !== undefined) return stroke;

      const startVertex = node.vectorNetwork.vertices[region.segments[0].start];
      const endVertex =
        node.vectorNetwork.vertices[region.segments[region.segments.length - 1].end];

      if (node.vectorNetwork.vertices.length > 0) {
        stroke.strokeCapStart = translateStrokeCap(startVertex);
        stroke.strokeCapEnd = translateStrokeCap(endVertex);
      }

      return stroke;
    })
  };
};

type Region = {
  region: VectorRegion | undefined;
  segments: VectorSegment[];
};

function findOpenPaths(vectorNetwork: VectorNetwork, visitedSegments: Set<number>): Region[] {
  const visitedVertices = new Set<number>();
  const openPaths: Region[] = [];

  vectorNetwork.segments.forEach((segment, segmentIndex) => {
    if (!visitedSegments.has(segmentIndex) && !visitedVertices.has(segment.start)) {
      const pathVertices = new Set<number>();
      const pathSegments: VectorSegment[] = [];
      const stack = [segment.start];

      while (stack.length > 0) {
        const vertex = stack.pop()!;

        if (!visitedVertices.has(vertex)) {
          visitedVertices.add(vertex);
          pathVertices.add(vertex);

          vectorNetwork.segments.forEach((seg, idx) => {
            if (!visitedSegments.has(idx) && (seg.start === vertex || seg.end === vertex)) {
              pathSegments.push(seg);
              stack.push(seg.start === vertex ? seg.end : seg.start);

              visitedSegments.add(idx);
            }
          });
        }
      }

      openPaths.push({ region: undefined, segments: pathSegments });
    }
  });

  return openPaths;
}

function splitVectorNetwork(vectorNetwork: VectorNetwork): Region[] {
  const visitedSegments = new Set<number>();

  const closedRegions: Region[] = (vectorNetwork.regions ?? []).map(region => {
    const regionSegments: VectorSegment[] = [];

    region.loops.forEach(loop => {
      regionSegments.push(
        ...loop.map(segmentIndex => {
          visitedSegments.add(segmentIndex);

          return vectorNetwork.segments[segmentIndex];
        })
      );
    });

    return { region, segments: regionSegments };
  });

  const openPaths = findOpenPaths(vectorNetwork, visitedSegments);

  return [...closedRegions, ...openPaths];
}

function createSVGPathData(vectorNetwork: VectorNetwork, region: Region): VectorPath {
  let path = '';
  let index = 0;

  region.segments.forEach(segment => {
    path += translateVectorSegmentToSvgPath(
      segment,
      vectorNetwork.vertices[segment.start],
      vectorNetwork.vertices[segment.end],
      index === 0
    );

    path += ' ';
    index += 1;
  });

  if (region.region) {
    path += 'Z';
  }

  return { data: path.trim(), windingRule: region.region?.windingRule ?? 'NONE' };
}

const translateVectorSegmentToSvgPath = (
  segment: VectorSegment,
  start: VectorVertex,
  end: VectorVertex,
  isFirst: boolean
): string => {
  const path = isFirst ? `M ${start.x} ${start.y}` : '';

  const c1 = segment.tangentStart;
  const c2 = segment.tangentEnd;

  if (c1 && c2 && c1.x > 0) {
    return (
      path +
      ` C ${start.x + c1.x} ${start.y + c1.y}, ${end.x + c2.x} ${end.y + c2.y}, ${end.x} ${end.y}`
    );
  }

  return path + `L ${end.x} ${end.y}`;
};
