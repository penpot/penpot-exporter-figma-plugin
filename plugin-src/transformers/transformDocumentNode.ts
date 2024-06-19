import { componentsLibrary } from '@plugin/ComponentLibrary';
import { imagesLibrary } from '@plugin/ImageLibrary';
import { remoteComponentLibrary } from '@plugin/RemoteComponentLibrary';
import { styleLibrary } from '@plugin/StyleLibrary';
import { translateRemoteChildren } from '@plugin/translators';
import { sleep } from '@plugin/utils';

import { PenpotPage } from '@ui/lib/types/penpotPage';
import { FillStyle } from '@ui/lib/types/utils/fill';
import { PenpotDocument } from '@ui/types';

import { transformPageNode } from '.';

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

  for (const [styleId, fills] of stylesToFetch) {
    const figmaStyle = await figma.getStyleByIdAsync(styleId);
    if (figmaStyle) {
      styles[styleId] = {
        name: figmaStyle.name,
        fills
      };
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
  const children = await processPages(node);

  if (remoteComponentLibrary.remaining() > 0) {
    children.push({
      name: 'External Components',
      children: await translateRemoteChildren()
    });
  }

  return {
    name: node.name,
    children,
    components: componentsLibrary.all(),
    images: await downloadImages(),
    styles: await getFillStyles()
  };
};
