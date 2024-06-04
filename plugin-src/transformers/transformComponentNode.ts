import { componentsLibrary } from '@plugin/ComponentLibrary';
import { remoteComponentsLibrary } from '@plugin/RemoteComponentLibrary';
import {
  transformBlend,
  transformChildren,
  transformCornerRadius,
  transformDimensionAndPosition,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformProportion,
  transformSceneNode,
  transformStrokes
} from '@plugin/transformers/partials';

import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { ComponentRoot } from '@ui/types';

export const transformComponentNode = async (
  node: ComponentNode,
  baseX: number,
  baseY: number,
  remote: boolean = false
): Promise<ComponentRoot> => {
  const library = remote ? remoteComponentsLibrary : componentsLibrary;
  const componentRoot = {
    figmaId: node.id,
    type: 'component'
  } as ComponentRoot;

  if (library.get(node.id)) {
    return componentRoot;
  }

  let component = {
    type: 'component',
    name: node.name,
    path: node.parent?.type === 'COMPONENT_SET' ? node.parent.name : '',
    ...transformFigmaIds(node),
    ...(await transformFills(node)),
    ...transformEffects(node),
    ...(await transformStrokes(node)),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformCornerRadius(node),
    ...transformDimensionAndPosition(node, baseX, baseY)
  } as ComponentShape;

  library.register(node.id, component);

  component = {
    ...component,
    ...(await transformChildren(node, baseX + node.x, baseY + node.y, remote))
  };

  library.register(node.id, component);

  return componentRoot;
};
