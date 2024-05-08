import { isGoogleFont } from './translators/text/font/gfonts';
import { isLocalFont } from './translators/text/font/local';

export const BASE_HEIGHT = 140;
export const BASE_WIDTH = 290;

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

  const buttonsHeight = 30;
  const textHeight = 200;
  const fontSize = 70;

  const newHeight =
    BASE_HEIGHT + buttonsHeight + (fonts.size > 0 ? textHeight + fonts.size * fontSize : 0);

  figma.ui.resize(BASE_WIDTH, newHeight);
};
