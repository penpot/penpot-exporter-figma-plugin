import { isGoogleFont } from '@plugin/translators/text/font/gfonts';
import { isLocalFont } from '@plugin/translators/text/font/local';

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
};

export const findMissingFonts = (node: TextNode): FontName[] => {
  if (node.fontName !== figma.mixed) {
    return isKnownFont(node.fontName) ? [] : [node.fontName];
  }

  const missingFonts: FontName[] = [];
  const styledTextSegments = node.getStyledTextSegments(['fontName']);

  styledTextSegments.map(segment => {
    if (!segment.fontName) return;

    if (isKnownFont(segment.fontName)) return;

    missingFonts.push(segment.fontName);
  });

  return missingFonts;
};

const extractMissingFonts = (node: TextNode, fonts: Set<string>) => {
  const missingFonts = findMissingFonts(node);

  missingFonts.forEach(font => {
    fonts.add(font.family);
  });
};

const isKnownFont = (fontName: FontName | undefined): boolean => {
  return isGoogleFont(fontName) || isLocalFont(fontName);
};
