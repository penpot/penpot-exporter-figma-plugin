import { translateVariable, translateVariableName } from '@plugin/translators/tokens';

import type { Set } from '@ui/lib/types/shapes/tokens';

export const translateSet = async (
  collection: VariableCollection,
  modeName: string,
  variables: Variable[],
  modeId: string
): Promise<[string, Set]> => {
  const setName = `${collection.name}/${modeName}`;
  const set: Set = {};

  for (const variable of variables) {
    const variableName = translateVariableName(variable);

    const result = await translateVariable(variable, variableName, modeId);
    if (!result) continue;

    const [name, token] = result;

    set[name] = token;
  }

  return [setName, set];
};
