import { variables } from '@plugin/libraries';
import { translateSet, translateTheme, translateVariable } from '@plugin/translators/tokens';

import type { Theme, Token, TokenSets, Tokens } from '@ui/lib/types/shapes/tokens';

const valueIsAlias = (value: Token['$value']): value is string => {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
};

const resolveAlias = (token: Token): Token | null => {
  if (!valueIsAlias(token.$value)) {
    return token;
  }

  const { $value, $type, $description } = token;

  const variableId = $value.slice(1, -1);

  const resolvedVariableName = variables.get(variableId + '.' + $type) ?? variables.get(variableId);
  if (!resolvedVariableName) {
    return null;
  }

  return {
    $value: '{' + resolvedVariableName + '}',
    $type,
    $description
  };
};

const isToken = (token: Token | Record<string, Token>): token is Token => {
  return '$value' in token;
};

// Tokens can be referencing other tokens, and the order is not guaranteed
// so we need to resolve them after the first pass to resolve all aliases.
const resolveAliases = (sets: TokenSets): TokenSets => {
  for (const [setName, set] of Object.entries(sets)) {
    for (const [tokenName, tokenValue] of Object.entries(set)) {
      if (isToken(tokenValue)) {
        const resolvedToken = resolveAlias(tokenValue);

        if (!resolvedToken) {
          delete sets[setName][tokenName];

          continue;
        }

        sets[setName][tokenName] = resolvedToken;
      } else {
        const resolvedTokens: Record<string, Token> = {};

        for (const [tokenType, token] of Object.entries(tokenValue)) {
          const resolvedToken = resolveAlias(token);

          if (!resolvedToken) continue;

          resolvedTokens[tokenType] = resolvedToken;
        }

        if (Object.keys(resolvedTokens).length === 0) {
          delete sets[setName][tokenName];

          continue;
        }

        sets[setName][tokenName] = resolvedTokens;
      }
    }
  }

  return sets;
};

const getVariables = async (collection: VariableCollection): Promise<Variable[]> => {
  const variables: Variable[] = [];

  for (const variableId of collection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);

    if (!variable) continue;

    variables.push(variable);
  }

  return variables;
};

export const processTokens = async (
  includeExternalVariables: boolean = false,
  externalVariableIds?: string[]
): Promise<Tokens | undefined> => {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();

  const sets: TokenSets = {};
  const themes: Theme[] = [];
  const tokenSetOrder: string[] = [];
  const activeSets: string[] = [];

  // Process local collections
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
        activeSets.push(setName);
      }
    }
  }

  // Process external variables if requested
  if (includeExternalVariables && externalVariableIds && externalVariableIds.length > 0) {
    // Group external variables by collection
    const variablesByCollection = new Map<
      string,
      { collection: VariableCollection; variables: Variable[] }
    >();

    for (const varId of externalVariableIds) {
      try {
        const variable = await figma.variables.getVariableByIdAsync(varId);
        if (!variable) continue;

        const collection = await figma.variables.getVariableCollectionByIdAsync(
          variable.variableCollectionId
        );
        if (!collection) continue;

        if (!variablesByCollection.has(collection.id)) {
          variablesByCollection.set(collection.id, { collection, variables: [] });
        }

        const entry = variablesByCollection.get(collection.id)!;
        if (!entry.variables.find(v => v.id === variable.id)) {
          entry.variables.push(variable);
        }
      } catch (error) {
        console.warn(`Could not process external variable ${varId}:`, error);
      }
    }

    // Process each external collection
    for (const { collection, variables: collectionVariables } of variablesByCollection.values()) {
      const defaultModeId = collection.defaultModeId;
      const collectionWithLibraryName = collection as { libraryName?: string };
      const libraryName = collectionWithLibraryName.libraryName ?? 'External';

      // Use library name as prefix to avoid collisions
      const collectionName = `${libraryName}/${collection.name}`;

      for (const mode of collection.modes) {
        const setName = `${collectionName}/${mode.name}`;
        const set: TokenSets[string] = {};

        // Translate only the variables we need from this collection
        for (const variable of collectionVariables) {
          const result = translateVariable(variable, mode.modeId);
          if (!result) continue;

          const [name, token] = result;
          set[name] = token;
        }

        if (Object.keys(set).length > 0) {
          sets[setName] = set;
          themes.push({
            name: mode.name,
            group: collectionName,
            description: '',
            isSource: false,
            selectedTokenSets: { [setName]: 'enabled' }
          });
          tokenSetOrder.push(setName);

          if (mode.modeId === defaultModeId) {
            activeSets.push(setName);
          }
        }
      }
    }
  }

  if (tokenSetOrder.length === 0) {
    return;
  }

  return {
    $metadata: { tokenSetOrder, activeThemes: [], activeSets },
    $themes: themes,
    ...resolveAliases(sets)
  };
};
