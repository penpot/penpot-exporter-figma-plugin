import { yieldByTime } from '@common/sleep';

import { transformPageNode } from '@plugin/transformers';
import { flushProgress, reportProgress } from '@plugin/utils';

import type { PenpotPage } from '@ui/lib/types/penpotPage';

export const processPages = async (node: DocumentNode): Promise<PenpotPage[]> => {
  const children = [];
  let processedPages = 0;

  reportProgress({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: node.children.length
  });

  for (const page of node.children) {
    await page.loadAsync();

    children.push(await transformPageNode(page));

    processedPages += 1;

    reportProgress({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: processedPages
    });

    await yieldByTime();
  }

  flushProgress();

  return children;
};
