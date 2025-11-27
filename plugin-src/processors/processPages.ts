import { yieldByTime } from '@common/sleep';

import { transformPageNode } from '@plugin/transformers';
import { flushProgress, reportProgress } from '@plugin/utils';

import type { PenpotPage } from '@ui/lib/types/penpotPage';
import type { ExportScope } from '@ui/types/progressMessages';

export const processPages = async (
  node: DocumentNode,
  scope: ExportScope
): Promise<PenpotPage[]> => {
  const children = [];
  let currentPage = 1;

  // Get pages to process based on scope
  const pagesToProcess = scope === 'current' ? [figma.currentPage] : node.children;

  reportProgress({
    type: 'PROGRESS_STEP',
    data: {
      step: 'processing',
      total: pagesToProcess.length
    }
  });

  await yieldByTime(undefined, true);

  for (const page of pagesToProcess) {
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
