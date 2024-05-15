export type PartialVectorNetwork = {
  vectorPath: VectorPath | undefined;
  region: VectorRegion | undefined;
  segments: VectorSegment[];
};

export const splitVectorNetwork = (node: VectorLikeMixin): PartialVectorNetwork[] => {
  const { vectorNetwork, vectorPaths } = node;
  const visitedSegments = new Set<number>();

  const closedRegions: PartialVectorNetwork[] = (vectorNetwork.regions ?? []).map(
    (region, index) => {
      const vectorPath = vectorPaths[index];
      const regionSegments: VectorSegment[] = [];

      region.loops.forEach(loop => {
        for (let index = loop.length - 1; index >= 0; index--) {
          const segmentIndex = loop[index];

          visitedSegments.add(segmentIndex);
          regionSegments.push(vectorNetwork.segments[segmentIndex]);
        }
      });

      return { vectorPath, region, segments: regionSegments };
    }
  );

  const openPaths = findOpenPaths(vectorNetwork, visitedSegments);

  return [...closedRegions, ...openPaths];
};

const findOpenPaths = (
  vectorNetwork: VectorNetwork,
  visitedSegments: Set<number>
): PartialVectorNetwork[] => {
  const { segments } = vectorNetwork;
  const visitedVertices = new Set<number>();
  const openPaths: PartialVectorNetwork[] = [];

  segments.forEach((segment, segmentIndex) => {
    if (visitedSegments.has(segmentIndex) || visitedVertices.has(segment.start)) return;

    const pathVertices = new Set<number>();
    const pathSegments: VectorSegment[] = [];
    const stack = [segment.start];

    while (stack.length > 0) {
      const vertex = stack.pop()!;

      if (visitedVertices.has(vertex)) continue;

      visitedVertices.add(vertex);
      pathVertices.add(vertex);

      segments.forEach((segment, segmentIndex) => {
        if (
          visitedSegments.has(segmentIndex) ||
          (segment.start !== vertex && segment.end !== vertex)
        )
          return;

        visitedSegments.add(segmentIndex);
        pathSegments.push(segment);

        stack.push(segment.start === vertex ? segment.end : segment.start);
      });
    }

    openPaths.push({ vectorPath: undefined, region: undefined, segments: pathSegments });
  });

  return openPaths;
};
