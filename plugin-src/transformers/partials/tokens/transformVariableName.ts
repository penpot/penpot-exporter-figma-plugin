import type { TokenType } from '@ui/lib/types/shapes/tokens';

const printType = (type: TokenType): string => {
  switch (type) {
    case 'color':
      return 'Color';
    case 'dimension':
      return 'Dimension';
    case 'number':
      return 'Number';
    case 'spacing':
      return 'Spacing';
    case 'letterSpacing':
      return 'LetterSpacing';
    case 'opacity':
      return 'Opacity';
    case 'sizing':
      return 'Sizing';
    case 'fontSizes':
      return 'FontSizes';
    case 'fontFamilies':
      return 'FontFamilies';
    case 'textDecoration':
      return 'TextDecoration';
    case 'borderRadius':
      return 'BorderRadius';
    case 'borderWidth':
      return 'BorderWidth';
    case 'textCase':
      return 'TextCase';
    case 'rotation':
      return 'Rotation';
    case 'fontWeights':
      return 'FontWeights';
  }
};

export const transformVariableName = (variable: Variable, type?: TokenType): string => {
  return `${variable.name.replace(/[-,/\s]/g, '.').replace(/[\][:\\]/g, '')}${type ? `.${printType(type)}` : ''}`;
};
