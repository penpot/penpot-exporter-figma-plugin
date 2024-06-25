import { overrides as overridesLibrary } from '@plugin/libraries';
import { syncAttributes } from '@plugin/utils/syncAttributes';

import { SyncGroups } from '@ui/lib/types/utils/syncGroups';

export const transformOverrides = (node: SceneNode) => {
  const overrides = overridesLibrary.get(node.id);
  if (!overrides) {
    return {};
  }

  const touched: SyncGroups[] = [];

  overrides.forEach(override => {
    if (syncAttributes[override]) {
      touched.push(...syncAttributes[override]);
    }
  });

  return {
    touched
  };
};
