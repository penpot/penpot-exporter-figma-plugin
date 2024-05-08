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

  if (fonts.size === 0) return;

  const originalSize = 140;
  const minimumExtraSize = 230;
  const fontSize = 70;

  figma.ui.resize(290, originalSize + minimumExtraSize + fonts.size * fontSize);
};
