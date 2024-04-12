import { PenpotPage } from '../../ui/lib/types/penpotPage';
import { transformSceneNode } from './transformSceneNode';

export const transformPageNode = async (node: PageNode): Promise<PenpotPage> => {
  return {
    name: node.name,
    children: await Promise.all(node.children.map(child => transformSceneNode(child)))
  };
};
