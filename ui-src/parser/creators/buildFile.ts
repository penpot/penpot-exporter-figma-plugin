import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import { PenpotContext } from '@ui/lib/types/penpotContext';
import { PenpotPage } from '@ui/lib/types/penpotPage';
import { components, identifiers } from '@ui/parser';
import {
  createColorsLibrary,
  createComponentsLibrary,
  createPage,
  createTextLibrary
} from '@ui/parser/creators';

export const buildFile = async (
  context: PenpotContext,
  children: PenpotPage[]
): Promise<PenpotContext> => {
  let pagesBuilt = 1;

  components.clear();
  identifiers.clear();

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

    await sleep(0);
  }

  await createColorsLibrary(context);
  await createTextLibrary(context);

  await createComponentsLibrary(context);

  return context;
};
