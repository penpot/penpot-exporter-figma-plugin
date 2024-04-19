import { transformChildren } from '@plugin/transformers/partials';

import { PenpotPage } from '@ui/lib/types/penpotPage';

export const transformPageNode = async (node: PageNode): Promise<PenpotPage> => {
  return {
    name: node.name,
    ...(await transformChildren(node))
  };
};
