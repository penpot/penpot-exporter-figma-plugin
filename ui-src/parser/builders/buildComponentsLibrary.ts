import { yieldByTime } from '@common/sleep';

import { flushMessageQueue, sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import { components } from '@ui/parser';

export const buildComponentsLibrary = async (context: PenpotContext): Promise<void> => {
  let componentsBuilt = 1;

  sendMessage({
    type: 'PROGRESS_STEP',
    data: {
      step: 'components',
      total: components.size
    }
  });

  await yieldByTime(undefined, true);

  for (const [_, component] of components.entries()) {
    context.addComponent(component);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: componentsBuilt++
    });

    await yieldByTime();
  }

  flushMessageQueue();

  await yieldByTime(undefined, true);
};
