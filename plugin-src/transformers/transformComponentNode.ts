import { v4 as uuidv4 } from 'uuid';

import { transformDimensionAndPosition } from '@plugin/transformers/partials';
import { transformChildren } from '@plugin/transformers/partials';

import { ComponentShape } from '@ui/lib/types/component/componentShape';

export const transformComponentNode = async (
  node: ComponentNode,
  baseX: number,
  baseY: number
): Promise<ComponentShape> => {
  console.log(self);

  const id = uuidv4();

  return {
    id,
    type: 'component',
    name: node.name,
    path: '',
    mainInstanceId: id,
    mainInstancePage: '',
    ...(await transformChildren(node, baseX + node.x, baseY + node.y)),
    ...transformDimensionAndPosition(node, baseX, baseY)
  };
};
