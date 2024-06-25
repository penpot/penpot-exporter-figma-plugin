import { remoteComponents } from '@plugin/libraries';
import { transformPageNode } from '@plugin/transformers';
import { translateRemoteChildren } from '@plugin/translators';
import { sleep } from '@plugin/utils';

import { PenpotPage } from '@ui/lib/types/penpotPage';

export const processPages = async (node: DocumentNode): Promise<PenpotPage[]> => {
  const children = await processLocalDocument(node);
  const remoteComponents = await processRemoteComponents();
  if (remoteComponents) {
    children.push(remoteComponents);
  }

  return children;
};

const processRemoteComponents = async (): Promise<PenpotPage | undefined> => {
  if (remoteComponents.remaining() > 0) {
    return {
      name: 'External Components',
      children: await translateRemoteChildren()
    };
  }
};

const processLocalDocument = async (node: DocumentNode): Promise<PenpotPage[]> => {
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
