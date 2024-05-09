import { PenpotDocument } from '@ui/lib/types/penpotDocument';
import { PenpotPage } from '@ui/lib/types/penpotPage';

import { transformPageNode } from '.';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const children: PenpotPage[] = [];

  for (const child of node.children) {
    await child.loadAsync();

    children.push(await transformPageNode(child));
  }

  return {
    name: node.name,
    children
  };
};
