import { componentsLibrary } from '@plugin/ComponentLibrary';
import { imagesLibrary } from '@plugin/ImageLibrary';
import { remoteComponentLibrary } from '@plugin/RemoteComponentLibrary';
import { styleLibrary } from '@plugin/StyleLibrary';
import { textLibrary } from '@plugin/TextLibrary';
import { translateRemoteChildren } from '@plugin/translators';
import { translatePaintStyle, translateTextStyle } from '@plugin/translators/styles';
import { sleep } from '@plugin/utils';

import { PenpotPage } from '@ui/lib/types/penpotPage';
import { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import { FillStyle } from '@ui/lib/types/utils/fill';
import { PenpotDocument } from '@ui/types';

import { transformPageNode } from '.';

const isPaintStyle = (style: BaseStyle): style is PaintStyle => {
  return style.type === 'PAINT';
};

const isTextStyle = (style: BaseStyle): style is TextStyle => {
  return style.type === 'TEXT';
};

const downloadImages = async (): Promise<Record<string, Uint8Array>> => {
  const imageToDownload = Object.entries(imagesLibrary.all());
  const images: Record<string, Uint8Array> = {};

  if (imageToDownload.length === 0) return images;

  let currentImage = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: imageToDownload.length
  });

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'images'
  });

  for (const [key, image] of imageToDownload) {
    const bytes = await image?.getBytesAsync();

    if (bytes) {
      images[key] = bytes;
    }

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentImage++
    });

    await sleep(0);
  }

  await sleep(20);

  return images;
};

const getFillStyles = async (): Promise<Record<string, FillStyle>> => {
  const stylesToFetch = Object.entries(styleLibrary.all());
  const styles: Record<string, FillStyle> = {};

  if (stylesToFetch.length === 0) return styles;

  let currentStyle = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: stylesToFetch.length
  });

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'fills'
  });

  for (const [styleId, paintStyle] of stylesToFetch) {
    const figmaStyle = paintStyle ?? (await figma.getStyleByIdAsync(styleId));
    if (figmaStyle && isPaintStyle(figmaStyle)) {
      styles[styleId] = translatePaintStyle(figmaStyle);
    }

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentStyle++
    });

    await sleep(0);
  }

  await sleep(20);

  return styles;
};

const getTextStyles = async (): Promise<Record<string, TypographyStyle>> => {
  const stylesToFetch = Object.entries(textLibrary.all());
  const styles: Record<string, TypographyStyle> = {};

  if (stylesToFetch.length === 0) return styles;

  let currentStyle = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: stylesToFetch.length
  });

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'typographies'
  });

  for (const [styleId, style] of stylesToFetch) {
    const figmaStyle = style ?? (await figma.getStyleByIdAsync(styleId));
    if (figmaStyle && isTextStyle(figmaStyle)) {
      styles[styleId] = translateTextStyle(figmaStyle);
    }

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentStyle++
    });

    await sleep(0);
  }

  await sleep(20);

  return styles;
};

const processPages = async (node: DocumentNode): Promise<PenpotPage[]> => {
  const children = [];
  let currentPage = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: node.children.length
  });

  for (const page of node.children) {
    await page.loadAsync();

    children.push(await transformPageNode(page));

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentPage++
    });

    await sleep(0);
  }

  return children;
};

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const localPaintStyles = await figma.getLocalPaintStylesAsync();
  localPaintStyles.forEach(style => {
    styleLibrary.register(style.id, style);
  });

  const localTextStyles = await figma.getLocalTextStylesAsync();
  localTextStyles.forEach(style => {
    textLibrary.register(style.id, style);
  });

  const children = await processPages(node);

  if (remoteComponentLibrary.remaining() > 0) {
    children.push({
      name: 'External Components',
      children: await translateRemoteChildren()
    });
  }

  const styles = await getFillStyles();

  const images = await downloadImages();

  const typographies = await getTextStyles();

  return {
    name: node.name,
    children,
    components: componentsLibrary.all(),
    images,
    styles,
    typographies
  };
};
