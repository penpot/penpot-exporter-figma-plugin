import type { TokenType } from '@ui/lib/types/shapes/tokens';

export const translateScope = (scope: VariableScope): TokenType | null => {
  switch (scope) {
    case 'CORNER_RADIUS':
      return 'borderRadius';
    case 'WIDTH_HEIGHT':
      return 'sizing';
    case 'GAP':
      return 'spacing';
    case 'STROKE_FLOAT':
      return 'borderWidth';
    case 'OPACITY':
      return 'opacity';
    case 'FONT_STYLE':
    case 'FONT_WEIGHT':
      return 'fontWeights';
    case 'FONT_SIZE':
      return 'fontSizes';
    case 'LETTER_SPACING':
      return 'letterSpacing';
    case 'FONT_FAMILY':
      return 'fontFamilies';
    default:
      return null;
  }
};
