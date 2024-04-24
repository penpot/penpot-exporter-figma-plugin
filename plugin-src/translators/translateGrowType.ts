import { GrowType } from '@ui/lib/types/shape/shapeAttributes';

export const translateGrowType = (
  growType: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'TRUNCATE'
): GrowType => {
  switch (growType) {
    case 'WIDTH_AND_HEIGHT':
      return 'auto-width';
    case 'HEIGHT':
      return 'auto-height';
    case 'TRUNCATE':
    default:
      return 'fixed';
  }
};
