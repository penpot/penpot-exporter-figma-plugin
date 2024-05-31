import { isGoogleFont } from '@plugin/translators/text/font/gfonts';
import { isLocalFont } from '@plugin/translators/text/font/local';
import { sleep } from '@plugin/utils';

import { registerChange } from './registerChange';

export const findAllTextNodes = async () => {
  const fonts = new Set<string>();

  for (const page of figma.root.children) {
    await page.loadAsync();

    for (const node of page.children) {
      if (node.type === 'TEXT') {
        extractMissingFonts(node, fonts);
      }

      sleep(0);
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
