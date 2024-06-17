import { isGoogleFont } from '@plugin/translators/text/font/gfonts';
import { isLocalFont } from '@plugin/translators/text/font/local';

import { registerChange } from './registerChange';

export const findAllTextNodes = async () => {
  const fonts = new Set<string>();

  for (const page of figma.root.children) {
    await page.loadAsync();

    const nodes = page.findAll(node => node.type === 'TEXT') as TextNode[];

    for (const node of nodes) {
      extractMissingFonts(node, fonts);
    }
  }

  figma.ui.postMessage({
    type: 'CUSTOM_FONTS',
    data: Array.from(fonts)
  });

  figma.currentPage.once('nodechange', registerChange);
};

const extractMissingFonts = (node: TextNode, fonts: Set<string>) => {
  const styledTextSegments = node.getStyledTextSegments(['fontName']);

  styledTextSegments.forEach(segment => {
    if (isGoogleFont(segment.fontName) || isLocalFont(segment.fontName)) {
      return;
    }

    fonts.add(segment.fontName.family);
  });
};
