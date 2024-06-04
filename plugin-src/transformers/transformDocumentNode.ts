import { componentsLibrary } from '@plugin/ComponentLibrary';
import { imagesLibrary } from '@plugin/ImageLibrary';
import { sleep } from '@plugin/utils';
import { remoteComponentsLibrary } from '@plugin/RemoteComponentLibrary';

import { PenpotDocument } from '@ui/types';

import { transformPageNode } from '.';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const children = [];
  let currentPage = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_PAGES',
    data: node.children.length
  });

  for (const page of node.children) {
    await page.loadAsync();

    children.push(await transformPageNode(page));

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_PAGES',
      data: currentPage++
    });

    await sleep(0);
  }

  return {
    name: node.name,
    children,
    components: componentsLibrary.all(),
    remoteComponents: remoteComponentsLibrary.all(),
    images: imagesLibrary.all()
  };
};
