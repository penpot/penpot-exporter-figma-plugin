import { sleep } from '@common/sleep';

import { transformPageNode } from '@plugin/transformers';

import { PenpotPage } from '@ui/lib/types/penpotPage';

export const processPages = async (node: DocumentNode): Promise<PenpotPage[]> => {
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
