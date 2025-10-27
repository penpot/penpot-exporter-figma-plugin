import { transformVariable } from '@plugin/transformers/partials/tokens';

import type { Set } from '@ui/lib/types/shapes/tokens';

export const transformSet = (
  collection: VariableCollection,
  modeName: string,
  variables: Variable[],
  modeId: string
): [string, Set] => {
  const hasMultipleModes = collection.modes.length > 1;
  const setName = hasMultipleModes ? `${collection.name}/${modeName}` : collection.name;
  const set: Set = {};

  for (const variable of variables) {
    const result = transformVariable(variable, modeId);
    if (!result) continue;

    const [name, token] = result;

    set[name] = token;
  }

  return [setName, set];
};
