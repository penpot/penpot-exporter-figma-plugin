// import { PartialVectorNetwork } from '.';

// export const translatePartialVectorNetwork = (
//   vectorNetwork: VectorNetwork,
//   partialVectorNetwork: PartialVectorNetwork
// ): VectorPath => {
//   const { segments } = partialVectorNetwork;
//   let isClosed = false;
//   let data = '';
//   const visitedVertex = new Set<number>([segments[0].start]);
//   let moveTo = true;

//   segments.forEach((segment, index) => {
//     const segmentPath = translateVectorSegment(
//       segment,
//       vectorNetwork.vertices[segment.start],
//       vectorNetwork.vertices[segment.end],
//       moveTo
//     );

//     data += segmentPath;

//     if (visitedVertex.has(segment.end)) {
//       isClosed = true;
//       moveTo = true;
//       data += ' Z';
//     } else {
//       moveTo = false;
//     }

//     data += index === segments.length - 1 ? '' : ' ';

//     visitedVertex.add(segment.end);
//   });

//   return {
//     data,
//     windingRule: partialVectorNetwork.region?.windingRule ?? (isClosed ? 'NONZERO' : 'NONE')
//   };
// };

// const translateVectorSegment = (
//   segment: VectorSegment,
//   start: VectorVertex,
//   end: VectorVertex,
//   isFirst: boolean
// ): string => {
//   const path = isFirst ? `M ${start.x} ${start.y} ` : '';

//   const c1 = segment.tangentStart;
//   const c2 = segment.tangentEnd;

//   if (c1 && c2 && (c1.x !== 0 || c1.y !== 0 || c2.x !== 0 || c2.y !== 0)) {
//     return (
//       path +
//       `C ${start.x + c1.x} ${start.y + c1.y} ${end.x + c2.x} ${end.y + c2.y} ${end.x} ${end.y}`
//     );
//   }

//   return path + `L ${end.x} ${end.y}`;
// };
