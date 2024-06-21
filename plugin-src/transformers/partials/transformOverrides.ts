import { overridesLibrary } from '@plugin/OverridesLibrary';
import { syncAttributes } from '@plugin/utils/syncAttributes';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';
import { SyncGroups } from '@ui/lib/types/utils/syncGroups';

export const transformOverrides = (
  node: SceneNode
): Pick<ShapeAttributes, 'touched' | 'componentPropertyReferences'> => {
  const overrides = overridesLibrary.get(node.id);

  const touched: SyncGroups[] = [];

  if (overrides) {
    overrides.forEach(override => {
      if (syncAttributes[override]) {
        touched.push(...syncAttributes[override]);
      }
    });
  }

  return {
    touched,
    componentPropertyReferences: node.componentPropertyReferences
  };
};
