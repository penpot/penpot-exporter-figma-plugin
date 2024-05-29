import { transformChildren } from '@plugin/transformers/partials';
import { translatePageFill } from '@plugin/translators/fills';

import { PenpotPage } from '@ui/lib/types/penpotPage';

export const transformPageNode = async (node: PageNode): Promise<PenpotPage> => {
  console.log(node);
  return {
    name: node.name,
    options: {
      background: node.backgrounds.length ? translatePageFill(node.backgrounds[0]) : undefined
    },
    ...(await transformChildren(node))
  };
};
