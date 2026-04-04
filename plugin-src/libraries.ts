import type { ExternalVariableInfo } from '@plugin/processors/detectExternalVariables';
import { clearParsedCache } from '@plugin/transformers/partials/transformVectorPaths';
import { resetSharedLibrary } from '@plugin/transformers/transformComponentNode';

import type { Uuid } from '@ui/lib/types/utils/uuid';
import type { ComponentProperty, ComponentRoot, ExportScope, ExternalLibrary } from '@ui/types';

export const identifiers: Map<string, Uuid> = new Map();
export const missingFonts: Set<string> = new Set();
export const textStyles: Map<string, TextStyle | undefined> = new Map();
export const paintStyles: Map<string, PaintStyle | undefined> = new Map();
export const overrides: Map<string, NodeChangeProperty[]> = new Map();
export const images: Map<string, Image | null> = new Map();
export const components: Map<Uuid, ComponentRoot> = new Map();
export const componentProperties: Map<string, ComponentProperty> = new Map();
export const variantProperties: Map<Uuid, Set<string>> = new Map();
export const variables: Map<string, string> = new Map();
export const variableNames: Map<string, string> = new Map();
export const uniqueVariableNames: Set<string> = new Set();
export const externalLibraries: Map<string, string> = new Map();

/**
 * Pending export state - stored when waiting for user choice about external variables
 */
export type PendingExportState = {
  scope: ExportScope;
  libraries: ExternalLibrary[];
  externalVariables: ExternalVariableInfo[];
};

export let pendingExport: PendingExportState | null = null;

export const setPendingExport = (state: PendingExportState | null): void => {
  pendingExport = state;
};

export const clearPendingExport = (): void => {
  pendingExport = null;
};

/**
 * Clears all state maps and sets to prevent memory accumulation during exports.
 * Should be called at the start of each export to ensure clean state.
 */
export const clearAllState = (): void => {
  identifiers.clear();
  missingFonts.clear();
  textStyles.clear();
  paintStyles.clear();
  overrides.clear();
  images.clear();
  components.clear();
  componentProperties.clear();
  variantProperties.clear();
  variables.clear();
  variableNames.clear();
  uniqueVariableNames.clear();
  externalLibraries.clear();
  clearPendingExport();
  clearParsedCache();
  resetSharedLibrary();
};
