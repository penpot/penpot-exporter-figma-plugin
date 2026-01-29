import { isAliasValue, isColorValue, isNumberValue, isStringValue } from '@common/variables';

import { variables } from '@plugin/libraries';
import { translateSet, translateTheme } from '@plugin/translators/tokens';
import { rgbToString } from '@plugin/utils/rgbToString';

import type { Theme, Token, TokenSets, Tokens } from '@ui/lib/types/shapes/tokens';

const valueIsAlias = (value: Token['$value']): value is string => {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
};

/**
 * Resolves the final value of a variable, following alias chains if necessary.
 * This handles external variables from Design Systems that are not in the local variables map.
 */
export const resolveVariableValue = async (
  variableId: string,
  tokenType: string,
  maxDepth: number = 10
): Promise<Token['$value'] | null> => {
  if (maxDepth <= 0) {
    console.warn('Max alias resolution depth reached for variable:', variableId);
    return null;
  }

  const variable = await figma.variables.getVariableByIdAsync(variableId);
  if (!variable) {
    return null;
  }

  // Get the value from the first available mode
  const modeId = Object.keys(variable.valuesByMode)[0];
  if (!modeId) {
    return null;
  }

  const value = variable.valuesByMode[modeId];

  // If the value is another alias, resolve it recursively
  if (isAliasValue(value)) {
    return resolveVariableValue(value.id, tokenType, maxDepth - 1);
  }

  // Resolve based on token type
  if (tokenType === 'color' && isColorValue(value)) {
    return rgbToString(value);
  }

  if (isNumberValue(value)) {
    if (tokenType === 'opacity') {
      return (value / 100).toString();
    }
    return value.toString();
  }

  if (isStringValue(value)) {
    if (tokenType === 'fontFamilies') {
      return [value];
    }
    return value;
  }

  return null;
};

export const resolveAlias = async (token: Token): Promise<Token | null> => {
  if (!valueIsAlias(token.$value)) {
    return token;
  }

  const { $value, $type, $description } = token;

  const variableId = $value.slice(1, -1);

  // First, try to resolve from local variables map
  const resolvedVariableName = variables.get(variableId + '.' + $type) ?? variables.get(variableId);
  if (resolvedVariableName) {
    return {
      $value: '{' + resolvedVariableName + '}',
      $type,
      $description
    };
  }

  // Variable not found in local map - it's likely an external variable from a Design System
  // Resolve its final value instead of keeping the unresolvable alias
  const resolvedValue = await resolveVariableValue(variableId, $type);
  if (resolvedValue !== null) {
    return {
      $value: resolvedValue,
      $type,
      $description
    };
  }

  // Could not resolve the variable at all
  return null;
};

const isToken = (token: Token | Record<string, Token>): token is Token => {
  return '$value' in token;
};

// Tokens can be referencing other tokens, and the order is not guaranteed
// so we need to resolve them after the first pass to resolve all aliases.
const resolveAliases = async (sets: TokenSets): Promise<TokenSets> => {
  for (const [setName, set] of Object.entries(sets)) {
    for (const [tokenName, tokenValue] of Object.entries(set)) {
      if (isToken(tokenValue)) {
        const resolvedToken = await resolveAlias(tokenValue);

        if (!resolvedToken) {
          delete sets[setName][tokenName];

          continue;
        }

        sets[setName][tokenName] = resolvedToken;
      } else {
        const resolvedTokens: Record<string, Token> = {};

        for (const [tokenType, token] of Object.entries(tokenValue)) {
          const resolvedToken = await resolveAlias(token);

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

  const resolvedSets = await resolveAliases(sets);

  return {
    $metadata: { tokenSetOrder, activeThemes: [], activeSets },
    $themes: themes,
    ...resolvedSets
  };
};
