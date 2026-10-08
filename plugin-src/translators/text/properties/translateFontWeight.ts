// Compound names go first so 'extrabold' is not matched as 'bold'
const STYLE_WEIGHTS: [string, string][] = [
  ['extralight', '200'],
  ['extrabold', '800'],
  ['semibold', '600'],
  ['thin', '100'],
  ['light', '300'],
  ['medium', '500'],
  ['bold', '700'],
  ['black', '900']
];

export const translateFontWeight = (fontName: FontName | undefined): string => {
  if (!fontName) return '400';

  // Variable fonts prefix the weight in the style name (e.g. 'Display Bold', 'Condensed Light')
  const style = fontName.style?.toLowerCase().replace(/\s/g, '') ?? '';

  return STYLE_WEIGHTS.find(([name]) => style.includes(name))?.[1] ?? '400';
};
