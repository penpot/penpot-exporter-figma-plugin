import type { StrokeCaps } from '@ui/lib/types/utils/stroke';

export const translateConnectorStrokeCap = (cap: ConnectorStrokeCap): StrokeCaps | undefined => {
  switch (cap) {
    case 'NONE':
      return undefined;
    case 'ARROW_LINES':
      return 'line-arrow';
    case 'ARROW_EQUILATERAL':
    case 'TRIANGLE_FILLED':
      return 'triangle-arrow';
    case 'CIRCLE_FILLED':
      return 'circle-marker';
    case 'DIAMOND_FILLED':
      return 'diamond-marker';
    // ERD-style caps have no direct Penpot equivalent — fall back to line-arrow.
    case 'ERD_ZERO_OR_ONE':
    case 'ERD_EXACTLY_ONE':
    case 'ERD_ZERO_OR_MORE':
    case 'ERD_ONE_OR_MORE':
    case 'ERD_ONE':
    case 'ERD_MANY':
      return 'line-arrow';
    default:
      return undefined;
  }
};
