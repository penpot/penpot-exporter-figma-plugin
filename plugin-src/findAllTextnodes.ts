import { isGoogleFont } from './translators/text/gfonts';
import { isLocalFont } from './translators/text/local';

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

  figma.ui.resize(400, 280 + fonts.size * 40);
};
