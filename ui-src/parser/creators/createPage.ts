import { PenpotContext } from '@ui/lib/types/penpotContext';
import { PenpotPage } from '@ui/lib/types/penpotPage';

import { createItems } from '.';

export const createPage = (
  context: PenpotContext,
  { name, background, children = [] }: PenpotPage
) => {
  context.addPage({ name, background });

  createItems(context, children);

  context.closePage();
};
