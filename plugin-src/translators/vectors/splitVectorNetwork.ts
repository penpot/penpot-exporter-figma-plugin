export type PartialVectorNetwork = {
  region: VectorRegion | undefined;
  segments: VectorSegment[];
};

export const splitVectorNetwork = (vectorNetwork: VectorNetwork): PartialVectorNetwork[] => {
  const visitedSegments = new Set<number>();

  const closedRegions: PartialVectorNetwork[] = (vectorNetwork.regions ?? []).map(region => {
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
};

const findOpenPaths = (
  vectorNetwork: VectorNetwork,
  visitedSegments: Set<number>
): PartialVectorNetwork[] => {
  const visitedVertices = new Set<number>();
  const openPaths: PartialVectorNetwork[] = [];

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
};
