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
    type: 'PROGRESS_STEP',
    data: {
      step: 'building',
      total: children.length
    }
  });

  await yieldByTime(undefined, true);

  for (const page of children) {
    createPage(context, page);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: pagesBuilt++
    });

    await yieldByTime(undefined, true);
  }

  flushMessageQueue();

  await yieldByTime(undefined, true);
};
