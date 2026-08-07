import { yieldByTime } from '@common/sleep';

import { transformPageNode } from '@plugin/transformers';
import { flushProgress, reportProgress } from '@plugin/utils';

import type { PenpotPage } from '@ui/lib/types/penpotPage';
import type { ExportScope } from '@ui/types';

/**
 * Resolves which pages must be exported for the given scope.
 *
 * For the `selection` scope the document order is preserved, regardless of the
 * order the ids were received in.
 */
export const selectPagesToProcess = (
  node: DocumentNode,
  scope: ExportScope,
  pageIds: string[]
): PageNode[] => {
  if (scope === 'current') return [figma.currentPage];

  if (scope === 'selection') {
    const selectedIds = new Set(pageIds);
    const pages = node.children.filter(page => selectedIds.has(page.id));

    if (pages.length === 0) {
      throw new Error(
        'None of the selected pages could be found in this document. They may have been deleted or renamed; reopen the plugin and select the pages again.'
      );
    }

    return pages;
  }

  return [...node.children];
};

export const processPages = async (
  node: DocumentNode,
  scope: ExportScope,
  pageIds: string[] = []
): Promise<PenpotPage[]> => {
  const children = [];
  let currentPage = 1;

  // Get pages to process based on scope
  const pagesToProcess = selectPagesToProcess(node, scope, pageIds);

  reportProgress({
    type: 'PROGRESS_STEP',
    data: {
      step: 'processing',
      total: pagesToProcess.length
    }
  });

  await yieldByTime(undefined, true);

  for (const page of pagesToProcess) {
    // Reported before loading, so the name shows up while the page is still
    // being read instead of only once its layers start coming through.
    reportProgress({
      type: 'PROGRESS_CURRENT_PAGE',
      data: page.name
    });

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
