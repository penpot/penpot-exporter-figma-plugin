import { overridesLibrary } from '@plugin/OverridesLibrary';
import { syncAttributes } from '@plugin/utils/syncAttributes';

import { SyncGroups } from '@ui/lib/types/utils/syncGroups';

export const transformOverrides = (node: SceneNode) => {
  const overrides = overridesLibrary.get(node.id);
  if (!overrides) {
    return {};
  }

  let touched: SyncGroups[] = [];

  overrides.forEach(override => {
    if (syncAttributes[override]) {
      touched = [...touched, ...syncAttributes[override]];
    }
  });

  return {
    touched
  };
};
