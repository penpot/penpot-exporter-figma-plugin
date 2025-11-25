import { variables } from '@plugin/libraries';
import { translateSet, translateTheme } from '@plugin/translators/tokens';

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

export const processTokens = async (): Promise<Tokens | undefined> => {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();

  const sets: TokenSets = {};
  const themes: Theme[] = [];
  const tokenSetOrder: string[] = [];
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
        activeSets.push(setName);
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
