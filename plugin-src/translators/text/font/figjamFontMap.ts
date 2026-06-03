import { isFigJamEditor } from '@plugin/utils';

// FigJam's stock fonts (e.g. "Figma Hand") are private to Figma and unavailable
// in Penpot. Substitute the closest Google Font equivalent shipped with Penpot.
const FIGJAM_FONT_MAP: Record<string, string> = {
  'Figma Hand': 'Kalam'
};

export const remapFigJamFontName = (fontName: FontName | undefined): FontName | undefined => {
  if (!fontName || !isFigJamEditor()) return fontName;

  const target = FIGJAM_FONT_MAP[fontName.family];
  if (!target) return fontName;

  return { ...fontName, family: target };
};
