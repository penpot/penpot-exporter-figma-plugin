import { yieldByTime } from '@common/sleep';

import { transformPageNode } from '@plugin/transformers';
import { flushProgress, reportProgress } from '@plugin/utils';

import type { PenpotPage } from '@ui/lib/types/penpotPage';

export const processPages = async (node: DocumentNode): Promise<PenpotPage[]> => {
  const children = [];
  let currentPage = 1;

  reportProgress({
    type: 'PROGRESS_STEP',
    data: {
      step: 'processing',
      total: node.children.length
    }
  });

  await yieldByTime(undefined, true);

  for (const page of node.children) {
    await page.loadAsync();

    children.push(await transformPageNode(page));

    reportProgress({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentPage++
    });

    await yieldByTime();
  }

  flushProgress();

  await yieldByTime(undefined, true);

  return children;
};
