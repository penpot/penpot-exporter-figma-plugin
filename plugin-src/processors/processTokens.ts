import { translateSet, translateTheme } from '@plugin/translators/tokens';

import type { Theme, TokenSets, Tokens } from '@ui/lib/types/shapes/tokens';

const getVariables = async (collection: VariableCollection): Promise<Variable[]> => {
  const variables: Variable[] = [];

  for (const variableId of collection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);

    if (!variable) continue;

    variables.push(variable);
  }

  return variables;
};

export const processTokens = async (): Promise<Tokens> => {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();

  const sets: TokenSets = {};
  const themes: Theme[] = [];
  const tokenSetOrder: string[] = [];
  const activeThemes: string[] = [];
  const activeSets: string[] = [];

  for (const collection of localCollections) {
    const collectionVariables = await getVariables(collection);
    const defaultModeId = collection.defaultModeId;

    for (const mode of collection.modes) {
      const [setName, set] = translateSet(collection, mode.name, collectionVariables, mode.modeId);
      const theme = translateTheme(collection, mode.name, setName);

      sets[setName] = set;
      themes.push(theme);
      tokenSetOrder.push(setName);

      if (mode.modeId === defaultModeId) {
        activeThemes.push(setName);
        activeSets.push(setName);
      }
    }
  }

  return {
    $metadata: { tokenSetOrder, activeThemes, activeSets },
    $themes: themes,
    ...sets
  };
};
