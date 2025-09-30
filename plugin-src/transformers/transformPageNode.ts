import { translateChildren } from '@plugin/translators';
import { translatePageFill } from '@plugin/translators/fills';

import type { PenpotPage } from '@ui/lib/types/penpotPage';

export const transformPageNode = async (node: PageNode): Promise<PenpotPage> => {
  return {
    name: node.name,
    background: node.backgrounds.length ? translatePageFill(node.backgrounds[0]) : undefined,
    children: await translateChildren(node.children)
  };
};
