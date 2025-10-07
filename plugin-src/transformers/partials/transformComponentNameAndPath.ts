import type { ComponentShape } from '@ui/lib/types/shapes/componentShape';

export const transformComponentNameAndPath = (
  node: ComponentNode
): Pick<ComponentShape, 'name' | 'path'> => {
  const name = node.parent?.type === 'COMPONENT_SET' ? node.parent.name : node.name;

  return {
    name,
    path: name.split(' / ').slice(0, -1).join(` / `)
  };
};
