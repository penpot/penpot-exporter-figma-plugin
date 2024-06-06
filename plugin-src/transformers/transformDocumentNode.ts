import { componentsLibrary } from '@plugin/ComponentLibrary';
import { imagesLibrary } from '@plugin/ImageLibrary';
import { remoteComponentLibrary } from '@plugin/RemoteComponentLibrary';
import { translateRemoteChildren } from '@plugin/translators';
import { sleep } from '@plugin/utils';

import { PenpotPage } from '@ui/lib/types/penpotPage';
import { PenpotDocument } from '@ui/types';

import { transformPageNode } from '.';

const downloadImages = async (): Promise<Record<string, Uint8Array>> => {
  const imageToDownload = Object.entries(imagesLibrary.all());
  const images: Record<string, Uint8Array> = {};
  let currentImage = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'images'
  });

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: imageToDownload.length
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
    images: await downloadImages()
  };
};
