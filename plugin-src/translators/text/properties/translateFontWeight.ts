export const translateFontWeight = (fontName: FontName | undefined): string => {
  if (!fontName) return '400';

  switch (fontName.style) {
    case 'Thin':
    case 'Thin Italic':
      return '100';
    case 'Extra Light':
    case 'ExtraLight':
    case 'Extra Light Italic':
    case 'ExtraLight Italic':
      return '200';
    case 'Light':
    case 'Light Italic':
      return '300';
    case 'Regular':
    case 'Italic':
      return '400';
    case 'Medium':
    case 'Medium Italic':
      return '500';
    case 'Semi Bold':
    case 'SemiBold':
    case 'Semi Bold Italic':
    case 'SemiBold Italic':
      return '600';
    case 'Bold':
    case 'Bold Italic':
      return '700';
    case 'ExtraBold':
    case 'Extra Bold':
    case 'ExtraBold Italic':
    case 'Extra Bold Italic':
      return '800';
    case 'Black':
    case 'Black Italic':
      return '900';
    default:
      return '400';
  }
};
