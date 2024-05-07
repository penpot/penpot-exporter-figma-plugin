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

  const maxHeight = 300;

  if (fonts.size === 0) return;

  if (fonts.size * 40 > maxHeight) {
    figma.ui.resize(400, 300 + maxHeight);
    return;
  }

  figma.ui.resize(400, 300 + fonts.size * 40);
};
