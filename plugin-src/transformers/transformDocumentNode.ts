import { componentsLibrary } from '@plugin/ComponentLibrary';
import { imagesLibrary } from '@plugin/ImageLibrary';
import { remoteComponentLibrary } from '@plugin/RemoteComponentLibrary';
import { translateRemoteChildren } from '@plugin/translators';
import { sleep } from '@plugin/utils';

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

  if (remoteComponentLibrary.length() > 0) {
    children.push({
      name: 'External Components',
      children: await translateRemoteChildren()
    });
  }

  return {
    name: node.name,
    children,
    components: componentsLibrary.all(),
    images: imagesLibrary.all()
  };
};
