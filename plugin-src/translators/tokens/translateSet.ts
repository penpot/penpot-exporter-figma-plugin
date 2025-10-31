import { translateVariable } from '@plugin/translators/tokens';

import type { Set } from '@ui/lib/types/shapes/tokens';

export const translateSet = (
  collection: VariableCollection,
  modeName: string,
  variables: Variable[],
  modeId: string
): [string, Set] => {
  const setName = `${collection.name}/${modeName}`;
  const set: Set = {};

  for (const variable of variables) {
    const result = translateVariable(variable, modeId);
    if (!result) continue;

    const [name, token] = result;

    set[name] = token;
  }

  return [setName, set];
};
