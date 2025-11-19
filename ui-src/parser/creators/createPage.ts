import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { PenpotPage } from '@ui/lib/types/penpotPage';
import { createItems } from '@ui/parser/creators';

export const createPage = (
  context: PenpotContext,
  { name, background, children = [] }: PenpotPage
): void => {
  context.addPage({ name, background });

  createItems(context, children);

  context.closePage();
};
