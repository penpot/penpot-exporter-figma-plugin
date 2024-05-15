import { PartialVectorNetwork } from '.';

export const translatePartialVectorNetwork = (
  vectorNetwork: VectorNetwork,
  partialVectorNetwork: PartialVectorNetwork
): VectorPath => {
  const { segments } = partialVectorNetwork;
  let data = '';

  segments.forEach((segment, index) => {
    const segmentPath = translateVectorSegment(
      segment,
      vectorNetwork.vertices[segment.start],
      vectorNetwork.vertices[segment.end],
      index === 0
    );

    data += segmentPath + (index === segments.length - 1 ? '' : ' ');
  });

  if (partialVectorNetwork.region) {
    data += ' Z';
  }

  return { data, windingRule: partialVectorNetwork.region?.windingRule ?? 'NONE' };
};

const translateVectorSegment = (
  segment: VectorSegment,
  start: VectorVertex,
  end: VectorVertex,
  isFirst: boolean
): string => {
  const path = isFirst ? `M ${start.x} ${start.y} ` : '';

  const c1 = segment.tangentStart;
  const c2 = segment.tangentEnd;

  if (c1 && c2 && (c1.x !== 0 || c1.y !== 0 || c2.x !== 0 || c2.y !== 0)) {
    return (
      path +
      `C ${start.x + c1.x} ${start.y + c1.y} ${end.x + c2.x} ${end.y + c2.y} ${end.x} ${end.y}`
    );
  }

  return path + `L ${end.x} ${end.y}`;
};
