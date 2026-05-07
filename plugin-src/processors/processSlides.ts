import { yieldByTime } from '@common/sleep';

import { transformSceneNode } from '@plugin/transformers';
import { flushProgress, reportProgress } from '@plugin/utils';

import type { PenpotPage } from '@ui/lib/types/penpotPage';
import type { PenpotNode } from '@ui/types/penpotNode';

export const processSlides = async (root: DocumentNode): Promise<PenpotPage[]> => {
  // documentAccess: dynamic-page requires loading every page before reading slide content.
  await figma.loadAllPagesAsync();

  // Reverse the grid: Penpot's layer panel renders the last child on top, and
  // the prototype playback follows the same order.
  const slides = figma.getCanvasGrid().flat().reverse();

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

  flushProgress();
  await yieldByTime(undefined, true);

  return [
    {
      name: root.name || 'Slides',
      children
    }
  ];
};
