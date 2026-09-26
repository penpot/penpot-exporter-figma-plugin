// Font families spell their style names differently ("SemiBold", "Semi Bold", "Semibold"),
// so compare them without case, spaces or the italic suffix.
const normalizeStyle = (style: string): string =>
  style
    .toLowerCase()
    .replace(/[\s_-]/g, '')
    .replace(/(italic|oblique)$/, '');

export const translateFontWeight = (fontName: FontName | undefined): string => {
  if (!fontName) return '400';

  switch (normalizeStyle(fontName.style ?? '')) {
    case 'thin':
    case 'hairline':
      return '100';
    case 'extralight':
    case 'ultralight':
      return '200';
    case 'light':
      return '300';
    case 'medium':
      return '500';
    case 'semibold':
    case 'demibold':
      return '600';
    case 'bold':
      return '700';
    case 'extrabold':
    case 'ultrabold':
      return '800';
    case 'black':
    case 'heavy':
      return '900';
    default:
      return '400';
  }
};
