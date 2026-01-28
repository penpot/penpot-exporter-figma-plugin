import type { ExportScope } from '@ui/types';

export type ExternalVariableInfo = {
  variableId: string;
  variableName: string;
  collectionId: string;
  collectionName: string;
  libraryName: string | null;
  usedIn: string[];
};

const getVariableIdFromAlias = (varAlias: VariableAlias | VariableAlias[]): string | null => {
  if (Array.isArray(varAlias)) {
    return varAlias.length > 0 ? (varAlias[0]?.id ?? null) : null;
  }
  return varAlias?.id ?? null;
};

const scanNodeForExternalVariables = async (
  node: SceneNode | PageNode,
  map: Map<string, ExternalVariableInfo>
): Promise<void> => {
  try {
    // Ensure node is loaded before accessing properties
    if ('loadAsync' in node && typeof node.loadAsync === 'function') {
      await node.loadAsync();
    }

    // Check boundVariables on the node itself
    if ('boundVariables' in node && node.boundVariables) {
      const boundVars = node.boundVariables as Record<string, VariableAlias | VariableAlias[]>;
      for (const [prop, varAlias] of Object.entries(boundVars)) {
        if (!varAlias) continue;

        const variableId = getVariableIdFromAlias(varAlias);
        if (!variableId) continue;

        await checkAndAddExternalVariable(variableId, prop, map);
      }
    }

    // Also check fills and strokes for bound variables (they may not be in boundVariables directly)
    if ('fills' in node && Array.isArray(node.fills)) {
      for (const fill of node.fills) {
        if (fill.type === 'SOLID' && fill.boundVariables?.color) {
          const variableId = fill.boundVariables.color.id;
          await checkAndAddExternalVariable(variableId, 'fills', map);
        }
      }
    }

    if ('strokes' in node && Array.isArray(node.strokes)) {
      for (const stroke of node.strokes) {
        if (stroke.type === 'SOLID' && stroke.boundVariables?.color) {
          const variableId = stroke.boundVariables.color.id;
          await checkAndAddExternalVariable(variableId, 'strokes', map);
        }
      }
    }

    // Recursively scan children
    if ('children' in node && node.children) {
      const childrenToScan = Array.isArray(node.children) ? node.children : [];

      for (const child of childrenToScan) {
        try {
          if ('loadAsync' in child && typeof child.loadAsync === 'function') {
            await child.loadAsync();
          }
          await scanNodeForExternalVariables(child, map);
        } catch (_error) {
          // Skip nodes that can't be scanned
        }
      }
    }
  } catch (_error) {
    // Skip nodes that can't be scanned
  }
};

const isAliasValue = (value: VariableValue): value is VariableAlias => {
  return typeof value === 'object' && value !== null && 'id' in value;
};

const checkVariableForExternalReferences = async (
  variable: Variable,
  visited: Set<string> = new Set()
): Promise<string[]> => {
  const externalVarIds: string[] = [];

  // Avoid infinite loops
  if (visited.has(variable.id)) {
    return externalVarIds;
  }
  visited.add(variable.id);

  // Check all values in all modes
  for (const [, value] of Object.entries(variable.valuesByMode)) {
    if (isAliasValue(value)) {
      // This variable references another variable
      const referencedVarId = value.id;

      try {
        const referencedVar = await figma.variables.getVariableByIdAsync(referencedVarId);
        if (!referencedVar) continue;

        // Check if the referenced variable is external
        const isExternal = referencedVar.remote;
        const referencedCollection = await figma.variables.getVariableCollectionByIdAsync(
          referencedVar.variableCollectionId
        );
        if (!referencedCollection) continue;
        const isExternalCollection = Boolean(
          (referencedCollection as { libraryName?: string }).libraryName
        );

        if (isExternal || isExternalCollection) {
          externalVarIds.push(referencedVarId);
        } else {
          // Recursively check if the referenced variable also references external variables
          const nestedExternalIds = await checkVariableForExternalReferences(
            referencedVar,
            visited
          );
          externalVarIds.push(...nestedExternalIds);
        }
      } catch (_error) {
        // Skip variables that can't be accessed
      }
    }
  }

  return externalVarIds;
};

const checkAndAddExternalVariable = async (
  variableId: string,
  prop: string,
  map: Map<string, ExternalVariableInfo>
): Promise<void> => {
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) return;

    // Check if variable is external (remote) OR if its collection is from an external library
    const collection = await figma.variables.getVariableCollectionByIdAsync(
      variable.variableCollectionId
    );
    if (!collection) return;

    const libraryName = (collection as { libraryName?: string }).libraryName;

    // A variable is external if:
    // 1. variable.remote is true, OR
    // 2. The collection has a libraryName (indicating it's from an external library)
    const isDirectlyExternal = variable.remote || Boolean(libraryName);

    if (isDirectlyExternal) {
      const existing = map.get(variableId);
      if (existing) {
        // Add property to usedIn if not already present
        if (!existing.usedIn.includes(prop)) {
          existing.usedIn.push(prop);
        }
      } else {
        map.set(variableId, {
          variableId: variable.id,
          variableName: variable.name,
          collectionId: collection.id,
          collectionName: collection.name,
          libraryName: libraryName ?? null,
          usedIn: [prop]
        });
      }
    } else {
      // Check if this local variable references external variables through aliases
      const externalRefIds = await checkVariableForExternalReferences(variable);

      if (externalRefIds.length > 0) {
        // Add all referenced external variables
        for (const extVarId of externalRefIds) {
          try {
            const extVar = await figma.variables.getVariableByIdAsync(extVarId);
            if (!extVar) continue;

            const extCollection = await figma.variables.getVariableCollectionByIdAsync(
              extVar.variableCollectionId
            );
            if (!extCollection) continue;

            const extLibraryName = (extCollection as { libraryName?: string }).libraryName;

            const existing = map.get(extVarId);
            if (existing) {
              // Add property to usedIn if not already present
              if (!existing.usedIn.includes(prop)) {
                existing.usedIn.push(prop);
              }
            } else {
              map.set(extVarId, {
                variableId: extVar.id,
                variableName: extVar.name,
                collectionId: extCollection.id,
                collectionName: extCollection.name,
                libraryName: extLibraryName ?? null,
                usedIn: [prop]
              });
            }
          } catch (_error) {
            // Skip variables that can't be accessed
          }
        }
      }
    }
  } catch (_error) {
    // Skip variables that can't be accessed
  }
};

export const detectExternalVariables = async (
  node: DocumentNode,
  scope: ExportScope
): Promise<ExternalVariableInfo[]> => {
  const externalVars = new Map<string, ExternalVariableInfo>();

  // Get pages to scan based on scope
  const pagesToScan = scope === 'current' ? [figma.currentPage] : node.children;

  for (const page of pagesToScan) {
    await page.loadAsync();
    await scanNodeForExternalVariables(page, externalVars);
  }

  return Array.from(externalVars.values());
};
