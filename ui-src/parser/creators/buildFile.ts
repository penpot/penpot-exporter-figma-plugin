import { yieldByTime } from '@common/sleep';

import { flushMessageQueue, sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { PenpotPage } from '@ui/lib/types/penpotPage';
import { components } from '@ui/parser';
import { createPage } from '@ui/parser/creators';

export const buildFile = async (context: PenpotContext, children: PenpotPage[]): Promise<void> => {
  let pagesBuilt = 1;

  components.clear();

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: children.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'building'
  });

  for (const page of children) {
    createPage(context, page);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: pagesBuilt++
    });

    await yieldByTime();
  }

  flushMessageQueue();
};
