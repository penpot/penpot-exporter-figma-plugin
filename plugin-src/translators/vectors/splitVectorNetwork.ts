// export type PartialVectorNetwork = {
//   vectorPath: VectorPath | undefined;
//   region: VectorRegion | undefined;
//   segments: VectorSegment[];
// };

// export const splitVectorNetwork = (node: VectorLikeMixin): PartialVectorNetwork[] => {
//   const { vectorNetwork, vectorPaths } = node;
//   const visitedSegments = new Set<number>();

//   const closedRegions: PartialVectorNetwork[] = (vectorNetwork.regions ?? []).map(
//     (region, index) => {
//       const vectorPath = vectorPaths[index];
//       const regionSegments: VectorSegment[] = [];

//       region.loops.forEach(loop => {
//         for (let index = 0; index < loop.length; index++) {
//           const segmentIndex = loop[index];

//           visitedSegments.add(segmentIndex);
//           regionSegments.push(vectorNetwork.segments[segmentIndex]);
//         }
//       });

//       return { vectorPath, region, segments: regionSegments };
//     }
//   );

//   const remainingPaths = findRemainingPaths(vectorNetwork, visitedSegments);

//   return [...closedRegions, ...remainingPaths];
// };

// const findRemainingPaths = (
//   vectorNetwork: VectorNetwork,
//   visitedSegments: Set<number>
// ): PartialVectorNetwork[] => {
//   const { segments } = vectorNetwork;
//   const remainingPaths: PartialVectorNetwork[] = [];

//   function findConsecutive(
//     segment: VectorSegment,
//     consecutive: VectorSegment[],
//     index: number
//   ): void {
//     visitedSegments.add(index);
//     consecutive.push(segment);

//     const nextSegmentIndex = segments.findIndex(
//       (seg, index) => seg.start === segment.end && !visitedSegments.has(index)
//     );
//     const nextSegment = segments[nextSegmentIndex];
//     if (nextSegment) {
//       findConsecutive(nextSegment, consecutive, nextSegmentIndex);
//     } else {
//       remainingPaths.push({ vectorPath: undefined, region: undefined, segments: consecutive });
//     }
//   }

//   segments.forEach((segment, index) => {
//     if (visitedSegments.has(index)) return;

//     const consecutiveSegments: VectorSegment[] = [];
//     findConsecutive(segment, consecutiveSegments, index);
//   });

//   console.log('remainingPaths', remainingPaths);
//   return remainingPaths;
// };
