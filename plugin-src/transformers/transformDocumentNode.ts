import { componentsLibrary } from '@plugin/ComponentLibrary';

import { PenpotDocument } from '@ui/types';

import { transformPageNode } from '.';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  return {
    name: node.name,
    children: await Promise.all(node.children.map(child => transformPageNode(child))),
    components: componentsLibrary.all()
  };
};
