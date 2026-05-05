import { yieldByTime } from '@common/sleep';

import { transformPageNode, transformSceneNode } from '@plugin/transformers';
import { flushProgress, isSlidesEditor, reportProgress } from '@plugin/utils';

import type { PenpotPage } from '@ui/lib/types/penpotPage';
import type { ExportScope } from '@ui/types';
import type { PenpotNode } from '@ui/types/penpotNode';

const processSlidesPage = async (root: DocumentNode): Promise<PenpotPage> => {
  // documentAccess: dynamic-page requires loading every page before reading slide content.
  await figma.loadAllPagesAsync();

  // Reverse the grid: Penpot's layer panel renders the last child on top, and
  // the prototype playback follows the same order.
  const slides = figma.getSlideGrid().flat().reverse();

  reportProgress({
    type: 'PROGRESS_STEP',
    data: {
      step: 'processing',
      total: slides.length,
      label: 'Figma slides scanned 💪',
      name: 'Scan Figma slides'
    }
  });

  await yieldByTime(undefined, true);

  const children: PenpotNode[] = [];
  let currentSlide = 1;

  for (const slide of slides) {
    const node = await transformSceneNode(slide);

    if (node) children.push(node);

    reportProgress({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentSlide++
    });

    await yieldByTime();
  }

  return {
    name: root.name || 'Slides',
    children
  };
};

export const processPages = async (
  node: DocumentNode,
  scope: ExportScope
): Promise<PenpotPage[]> => {
  if (isSlidesEditor()) {
    const page = await processSlidesPage(node);
    flushProgress();
    await yieldByTime(undefined, true);

    return [page];
  }

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
