import type { StrokeCaps } from '@ui/lib/types/utils/stroke';

// Map Figma FigJam connector caps onto Penpot stroke caps.
// ERD_* caps have no native Penpot equivalent — degrade to 'line-arrow'.
export const translateConnectorStrokeCap = (cap: ConnectorStrokeCap): StrokeCaps | undefined => {
  switch (cap) {
    case 'NONE':
      return undefined;
    case 'ARROW_EQUILATERAL':
    case 'TRIANGLE_FILLED':
      return 'triangle-arrow';
    case 'ARROW_LINES':
      return 'line-arrow';
    case 'DIAMOND_FILLED':
      return 'diamond-marker';
    case 'CIRCLE_FILLED':
      return 'circle-marker';
    default:
      return 'line-arrow';
  }
};
