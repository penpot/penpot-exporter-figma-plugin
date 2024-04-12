import { PenpotDocument } from '../../ui/lib/types/penpotDocument';
import { transformPageNode } from './transformPageNode';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  return {
    name: node.name,
    children: await Promise.all(node.children.map(child => transformPageNode(child)))
  };
};
