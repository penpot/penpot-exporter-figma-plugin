import {
  clearAllState,
  clearPendingExport,
  componentProperties,
  components,
  externalLibraries,
  images,
  missingFonts,
  overrides,
  paintStyles,
  pendingExport,
  setPendingExport,
  textStyles,
  variantProperties
} from '@plugin/libraries';
import {
  type ExternalVariableInfo,
  detectExternalVariables
} from '@plugin/processors/detectExternalVariables';
import { transformDocumentNode } from '@plugin/transformers';
import { flushProgress, reportProgress, resetProgress } from '@plugin/utils';

import type { ExportScope, ExternalLibrary, ExternalVariablesChoice } from '@ui/types';

const initializeExternalLibraries = (libraries: ExternalLibrary[]): void => {
  for (const library of libraries) {
    externalLibraries.set(library.name, library.uuid);
  }
};

/**
 * Continue export after external variables have been handled
 */
const continueExport = async (
  scope: ExportScope,
  libraries: ExternalLibrary[],
  externalVariablesToConvert?: ExternalVariableInfo[]
): Promise<void> => {
  initializeExternalLibraries(libraries);

  const document = await transformDocumentNode(figma.root, scope, externalVariablesToConvert);

  flushProgress();

  reportProgress({
    type: 'PENPOT_DOCUMENT',
    data: document
  });

  clearPendingExport();
};

export const handleExportMessage = async (
  scope: ExportScope,
  libraries: ExternalLibrary[]
): Promise<void> => {
  // Clear all state maps and caches to prevent memory accumulation
  clearAllState();
  resetProgress();

  // First, scan for external variables
  const externalVariablesReport = await detectExternalVariables(scope);

  // If external variables are found, pause export and notify UI
  if (externalVariablesReport.variables.length > 0) {
    // Store the pending export state
    setPendingExport({
      scope,
      libraries,
      externalVariables: externalVariablesReport.variables
    });

    // Notify UI about external variables
    reportProgress({
      type: 'EXTERNAL_VARIABLES_DETECTED',
      data: {
        variables: externalVariablesReport.variables.map(v => ({
          id: v.id,
          name: v.name,
          collectionName: v.collectionName,
          libraryName: v.libraryName
        })),
        libraries: externalVariablesReport.libraries
      }
    });

    // Export will continue when user makes a choice via handleExternalVariablesChoice
    return;
  }

  // No external variables found, continue with normal export
  await continueExport(scope, libraries);
};

/**
 * Handle user's choice about external variables
 */
export const handleExternalVariablesChoice = async (
  choice: ExternalVariablesChoice
): Promise<void> => {
  if (!pendingExport) {
    // No pending export, this shouldn't happen
    reportProgress({
      type: 'ERROR',
      data: 'No pending export found'
    });
    return;
  }

  const { scope, libraries, externalVariables } = pendingExport;

  switch (choice) {
    case 'export_as_is':
      // Continue export without converting external variables
      // External variable references will be skipped (current behavior)
      clearPendingExport();
      clearAllState();
      resetProgress();
      await continueExport(scope, libraries);
      break;

    case 'convert_to_local': {
      // Continue export and convert external variables to local tokens
      clearPendingExport();
      clearAllState();
      resetProgress();
      await continueExport(scope, libraries, externalVariables);
      break;
    }
  }
};

export const handleRetryMessage = async (): Promise<void> => {
  resetProgress();
  missingFonts.clear();
  textStyles.clear();
  paintStyles.clear();
  overrides.clear();
  images.clear();
  components.clear();
  componentProperties.clear();
  variantProperties.clear();
  clearPendingExport();

  reportProgress({
    type: 'RELOAD'
  });
};
