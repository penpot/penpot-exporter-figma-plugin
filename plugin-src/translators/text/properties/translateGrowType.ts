import { GrowType } from '@ui/lib/types/shapes/shape';

export const translateGrowType = (node: TextNode): GrowType => {
  if (node.leadingTrim === 'CAP_HEIGHT') {
    return 'fixed';
  }

  switch (node.textAutoResize) {
    case 'WIDTH_AND_HEIGHT':
      return 'auto-width';
    case 'HEIGHT':
      return 'auto-height';
    case 'TRUNCATE':
    default:
      return 'fixed';
  }
};
