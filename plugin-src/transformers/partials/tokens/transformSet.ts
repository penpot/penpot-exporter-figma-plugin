import { transformVariable } from '@plugin/transformers/partials/tokens';

import type { Set } from '@ui/lib/types/shapes/tokens';

export const transformSet = (
  collection: VariableCollection,
  modeName: string,
  variables: Variable[],
  modeId: string
): [string, Set] => {
  const setName = `${collection.name}/${modeName}`;
  const set: Set = {};

  for (const variable of variables) {
    const result = transformVariable(variable, modeId);
    if (!result) continue;

    Object.entries(result).forEach(([name, token]) => {
      set[name] = token;
    });
  }

  return [setName, set];
};
