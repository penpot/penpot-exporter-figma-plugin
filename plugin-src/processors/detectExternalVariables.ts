import type { ExportScope } from '@ui/types';

export type ExternalVariableInfo = {
  id: string;
  name: string;
  collectionId: string;
  collectionName: string;
  libraryName: string;
};

export type ExternalVariablesReport = {
  variables: ExternalVariableInfo[];
  libraries: string[];
};

/**
 * Extract all variable IDs from a node's boundVariables property
 */
const extractBoundVariableIds = (boundVariables: SceneNodeMixin['boundVariables']): string[] => {
  if (!boundVariables) return [];

  const ids: string[] = [];

  for (const value of Object.values(boundVariables)) {
    if (!value) continue;

    if (Array.isArray(value)) {
      for (const alias of value) {
        if (alias && typeof alias === 'object' && 'id' in alias && typeof alias.id === 'string') {
          ids.push(alias.id);
        }
      }
    } else if (typeof value === 'object' && 'id' in value && typeof value.id === 'string') {
      ids.push(value.id);
    }
  }

  return ids;
};

/**
 * Extract variable IDs from paint fills/strokes that have bound color variables
 */
const extractPaintVariableIds = (paints: readonly Paint[] | typeof figma.mixed): string[] => {
  if (paints === figma.mixed || !paints) return [];

  const ids: string[] = [];

  for (const paint of paints) {
    if (paint.type === 'SOLID' && paint.boundVariables?.color?.id) {
      ids.push(paint.boundVariables.color.id);
    }
  }

  return ids;
};

/**
 * Recursively traverse nodes and collect all bound variable IDs
 */
const collectBoundVariableIds = async (
  node: BaseNode,
  collectedIds: Set<string>
): Promise<void> => {
  // Check boundVariables on scene nodes
  if ('boundVariables' in node) {
    const sceneNode = node as SceneNode;
    const ids = extractBoundVariableIds(sceneNode.boundVariables);
    ids.forEach(id => collectedIds.add(id));
  }

  // Check fills and strokes for paint-level bound variables
  if ('fills' in node) {
    const fillNode = node as GeometryMixin;
    const fillIds = extractPaintVariableIds(fillNode.fills);
    fillIds.forEach(id => collectedIds.add(id));
  }

  if ('strokes' in node) {
    const strokeNode = node as MinimalStrokesMixin;
    const strokeIds = extractPaintVariableIds(strokeNode.strokes);
    strokeIds.forEach(id => collectedIds.add(id));
  }

  // Traverse children
  if ('children' in node) {
    const containerNode = node as ChildrenMixin;
    for (const child of containerNode.children) {
      await collectBoundVariableIds(child, collectedIds);
    }
  }
};

/**
 * Check if a local variable aliases to an external variable (indirect reference)
 */
const getAliasedVariableId = (variable: Variable, modeId: string): string | null => {
  const value = variable.valuesByMode[modeId];

  if (
    value &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'VARIABLE_ALIAS' &&
    'id' in value
  ) {
    return value.id;
  }

  return null;
};

/**
 * Detect external variables used in the document or current page
 */
export const detectExternalVariables = async (
  scope: ExportScope
): Promise<ExternalVariablesReport> => {
  // Get local collection IDs
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const localCollectionIds = new Set(localCollections.map(c => c.id));

  // Build a map of local variable IDs for quick lookup
  const localVariableIds = new Set<string>();
  for (const collection of localCollections) {
    for (const variableId of collection.variableIds) {
      localVariableIds.add(variableId);
    }
  }

  // Collect all bound variable IDs from nodes
  const boundVariableIds = new Set<string>();

  if (scope === 'current') {
    const currentPage = figma.currentPage;
    await collectBoundVariableIds(currentPage, boundVariableIds);
  } else {
    // Load all pages first before accessing their children
    await figma.loadAllPagesAsync();
    for (const page of figma.root.children) {
      await collectBoundVariableIds(page, boundVariableIds);
    }
  }

  // Also check local variables for aliases to external variables
  const aliasedExternalIds = new Set<string>();
  for (const collection of localCollections) {
    for (const variableId of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (!variable) continue;

      for (const modeId of Object.keys(variable.valuesByMode)) {
        const aliasedId = getAliasedVariableId(variable, modeId);
        if (aliasedId && !localVariableIds.has(aliasedId)) {
          aliasedExternalIds.add(aliasedId);
        }
      }
    }
  }

  // Combine direct and indirect (aliased) external variable references
  const allReferencedIds = new Set([...boundVariableIds, ...aliasedExternalIds]);

  // Get available library collections to verify external variables are from linked libraries
  const availableLibraryCollections =
    await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  // Build a map of available library collection keys to library info
  const linkedLibraryCollections = new Map<
    string,
    { libraryName: string; collectionName: string }
  >();
  for (const libCollection of availableLibraryCollections) {
    linkedLibraryCollections.set(libCollection.key, {
      libraryName: libCollection.libraryName || 'External Library',
      collectionName: libCollection.name
    });
  }

  // Filter to only external variables from LINKED libraries
  const externalVariables: ExternalVariableInfo[] = [];
  const libraryNames = new Set<string>();
  const processedIds = new Set<string>();

  for (const variableId of allReferencedIds) {
    if (processedIds.has(variableId)) continue;
    processedIds.add(variableId);

    try {
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (!variable) continue;

      // Skip if it's a local variable
      if (localCollectionIds.has(variable.variableCollectionId)) continue;

      // Get collection info for the variable
      const collection = await figma.variables.getVariableCollectionByIdAsync(
        variable.variableCollectionId
      );
      if (!collection) continue;

      // IMPORTANT: Only consider this an external variable if it's from a LINKED library
      // Check if the collection key matches any available library collection
      const libraryInfo = linkedLibraryCollections.get(collection.key);

      if (!libraryInfo) {
        // This is an orphaned variable reference (copied from another file but not linked)
        // Skip it - it's not from a currently linked library
        continue;
      }

      externalVariables.push({
        id: variable.id,
        name: variable.name,
        collectionId: collection.id,
        collectionName: libraryInfo.collectionName,
        libraryName: libraryInfo.libraryName
      });

      libraryNames.add(libraryInfo.libraryName);
    } catch {
      // Variable might not be accessible, skip it
      continue;
    }
  }

  return {
    variables: externalVariables,
    libraries: Array.from(libraryNames)
  };
};

/**
 * Get local collection IDs for use in other modules
 */
export const getLocalCollectionIds = async (): Promise<Set<string>> => {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  return new Set(localCollections.map(c => c.id));
};
