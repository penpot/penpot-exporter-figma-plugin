import { variables } from '@plugin/libraries';
import { translateVariable } from '@plugin/translators/tokens';

import type { Set, Theme, Token, TokenSets, Tokens } from '@ui/lib/types/shapes/tokens';

import type { ExternalVariableInfo } from './detectExternalVariables';

/**
 * Group external variables by their collection
 */
type CollectionGroup = {
  collectionId: string;
  collectionName: string;
  libraryName: string;
  variableIds: string[];
};

const groupByCollection = (externalVariables: ExternalVariableInfo[]): CollectionGroup[] => {
  const groups = new Map<string, CollectionGroup>();

  for (const variable of externalVariables) {
    const existing = groups.get(variable.collectionId);

    if (existing) {
      existing.variableIds.push(variable.id);
    } else {
      groups.set(variable.collectionId, {
        collectionId: variable.collectionId,
        collectionName: variable.collectionName,
        libraryName: variable.libraryName,
        variableIds: [variable.id]
      });
    }
  }

  return Array.from(groups.values());
};

/**
 * Fetch variables by their IDs
 */
const fetchVariables = async (variableIds: string[]): Promise<Variable[]> => {
  const fetchedVariables: Variable[] = [];

  for (const id of variableIds) {
    try {
      const variable = await figma.variables.getVariableByIdAsync(id);
      if (variable) {
        fetchedVariables.push(variable);
      }
    } catch {
      // Variable might not be accessible, skip it
      continue;
    }
  }

  return fetchedVariables;
};

/**
 * Sanitize a name to be valid for tokens (remove special characters, etc.)
 */
const sanitizeName = (name: string): string => {
  return name
    .replace(/\//g, '.')
    .replace(/[^a-zA-Z0-9\-$_.]/g, '')
    .replace(/^\$/, 'S')
    .replace(/^\./, 'D')
    .replace(/\.$/, 'D')
    .replace(/\.{2,}/g, '.')
    .replace(/^-/, 'H')
    .replace(/-$/, 'H');
};

/**
 * Create a unique variable name with library prefix to avoid collisions
 */
const createPrefixedVariableName = (
  variable: Variable,
  libraryName: string,
  usedNames: Set<string>
): string => {
  // Sanitize both the library name and variable name
  const sanitizedLibrary = sanitizeName(libraryName) || 'ExternalLib';
  let baseName = sanitizeName(variable.name);

  if (baseName === '') {
    baseName = 'unnamed';
  }

  // Add library prefix
  const prefixedName = `${sanitizedLibrary}.${baseName}`;
  let finalName = prefixedName;

  if (usedNames.has(finalName)) {
    let i = 1;
    while (usedNames.has(`${prefixedName}-${i}`)) {
      i++;
    }
    finalName = `${prefixedName}-${i}`;
  }

  usedNames.add(finalName);
  return finalName;
};

/**
 * Translate an external variable to a token
 * This is similar to translateVariable but handles the external context
 */
const translateExternalVariable = (
  variable: Variable,
  variableName: string,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  // Use the existing translateVariable logic
  const result = translateVariable(variable, modeId);

  if (!result) return null;

  const [, token] = result;

  // Return with the prefixed name instead
  return [variableName, token];
};

/**
 * Process external variables and convert them to tokens
 * This is called when user chooses "Convert to local variables"
 */
export const processExternalVariables = async (
  externalVariables: ExternalVariableInfo[]
): Promise<Tokens | undefined> => {
  if (externalVariables.length === 0) {
    return undefined;
  }

  const groups = groupByCollection(externalVariables);
  const sets: TokenSets = {};
  const themes: Theme[] = [];
  const tokenSetOrder: string[] = [];
  const activeSets: string[] = [];
  const usedNames = new Set<string>();

  for (const group of groups) {
    try {
      // Fetch the collection to get mode information
      const collection = await figma.variables.getVariableCollectionByIdAsync(group.collectionId);
      if (!collection) continue;

      // Fetch all variables for this collection
      const collectionVariables = await fetchVariables(group.variableIds);
      if (collectionVariables.length === 0) continue;

      const defaultModeId = collection.defaultModeId;

      // Sanitize names for use in token sets
      const sanitizedLibraryName = sanitizeName(group.libraryName) || 'ExternalLib';
      const sanitizedCollectionName = sanitizeName(group.collectionName) || 'Collection';

      // Process each mode
      for (const mode of collection.modes) {
        const sanitizedModeName = sanitizeName(mode.name) || 'Mode';
        // Create set name with library prefix: [LibraryName]/[CollectionName]/[ModeName]
        const setName = `${sanitizedLibraryName}/${sanitizedCollectionName}/${sanitizedModeName}`;
        const set: Set = {};

        // Process each variable in this collection
        for (const variable of collectionVariables) {
          const variableName = createPrefixedVariableName(
            variable,
            sanitizedLibraryName,
            usedNames
          );

          const result = translateExternalVariable(variable, variableName, mode.modeId);
          if (!result) continue;

          const [name, token] = result;
          set[name] = token;

          // Register the variable mapping for token lookups
          // This allows translateAppliedTokens to find the external variable
          registerExternalVariableMapping(variable, variableName);
        }

        if (Object.keys(set).length === 0) continue;

        sets[setName] = set;
        tokenSetOrder.push(setName);

        // Create theme for this mode
        themes.push({
          name: sanitizedModeName,
          group: `${sanitizedLibraryName}/${sanitizedCollectionName}`,
          description: '',
          isSource: false,
          selectedTokenSets: { [setName]: 'enabled' }
        });

        if (mode.modeId === defaultModeId) {
          activeSets.push(setName);
        }
      }
    } catch {
      // Skip collections that can't be processed
      continue;
    }
  }

  if (tokenSetOrder.length === 0) {
    return undefined;
  }

  return {
    $metadata: { tokenSetOrder, activeThemes: [], activeSets },
    $themes: themes,
    ...sets
  };
};

/**
 * Register the external variable in the variables map so it can be looked up
 * when translating applied tokens
 */
const registerExternalVariableMapping = (variable: Variable, variableName: string): void => {
  // Register for all relevant token types based on the variable's resolved type
  switch (variable.resolvedType) {
    case 'COLOR':
      variables.set(`${variable.id}.color`, variableName);
      break;
    case 'FLOAT':
      // Float variables can map to multiple token types
      variables.set(`${variable.id}.borderRadius`, variableName);
      variables.set(`${variable.id}.sizing`, variableName);
      variables.set(`${variable.id}.spacing`, variableName);
      variables.set(`${variable.id}.borderWidth`, variableName);
      variables.set(`${variable.id}.opacity`, variableName);
      variables.set(`${variable.id}.fontWeights`, variableName);
      variables.set(`${variable.id}.fontSizes`, variableName);
      variables.set(`${variable.id}.letterSpacing`, variableName);
      variables.set(`${variable.id}.number`, variableName);
      break;
    case 'STRING':
      variables.set(`${variable.id}.fontFamilies`, variableName);
      break;
  }
};

/**
 * Merge external tokens with local tokens
 */
export const mergeTokens = (
  localTokens: Tokens | undefined,
  externalTokens: Tokens | undefined
): Tokens | undefined => {
  if (!localTokens && !externalTokens) return undefined;
  if (!localTokens) return externalTokens;
  if (!externalTokens) return localTokens;

  const mergedSets: TokenSets = {};
  const mergedThemes: Theme[] = [];
  const mergedTokenSetOrder: string[] = [];
  const mergedActiveSets: string[] = [];

  // Add local tokens first
  for (const setName of localTokens.$metadata.tokenSetOrder) {
    if (setName in localTokens) {
      mergedSets[setName] = localTokens[setName] as Set;
      mergedTokenSetOrder.push(setName);
    }
  }
  mergedThemes.push(...localTokens.$themes);
  mergedActiveSets.push(...localTokens.$metadata.activeSets);

  // Add external tokens
  for (const setName of externalTokens.$metadata.tokenSetOrder) {
    if (setName in externalTokens) {
      mergedSets[setName] = externalTokens[setName] as Set;
      mergedTokenSetOrder.push(setName);
    }
  }
  mergedThemes.push(...externalTokens.$themes);
  mergedActiveSets.push(...externalTokens.$metadata.activeSets);

  return {
    $metadata: {
      tokenSetOrder: mergedTokenSetOrder,
      activeThemes: [],
      activeSets: mergedActiveSets
    },
    $themes: mergedThemes,
    ...mergedSets
  };
};
