import {
  BASE_WIDTH,
  MISSING_FONTS_TEXT_HEIGHT,
  MISSING_SINGLE_FONT_HEIGHT,
  NORMAL_HEIGHT
} from './pluginSizes';
import { isGoogleFont } from './translators/text/font/gfonts';
import { isLocalFont } from './translators/text/font/local';

export const findAllTextNodes = async () => {
  await figma.loadAllPagesAsync();

  const nodes = figma.root.findAllWithCriteria({
    types: ['TEXT']
  });

  const fonts = new Set<string>();

  nodes.forEach(node => {
    const styledTextSegments = node.getStyledTextSegments(['fontName']);

    styledTextSegments.forEach(segment => {
      if (isGoogleFont(segment.fontName) || isLocalFont(segment.fontName)) {
        return;
      }

      fonts.add(segment.fontName.family);
    });
  });

  figma.ui.postMessage({
    type: 'CUSTOM_FONTS',
    data: Array.from(fonts)
  });

  const newHeight =
    NORMAL_HEIGHT +
    (fonts.size > 0 ? MISSING_FONTS_TEXT_HEIGHT + fonts.size * MISSING_SINGLE_FONT_HEIGHT : 0);

  figma.ui.resize(BASE_WIDTH, newHeight);
};
