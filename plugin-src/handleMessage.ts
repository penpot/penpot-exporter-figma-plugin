import {
  clearAllState,
  componentProperties,
  components,
  externalLibraries,
  images,
  missingFonts,
  overrides,
  paintStyles,
  textStyles,
  variantProperties
} from '@plugin/libraries';
import { detectExternalVariables } from '@plugin/processors';
import { transformDocumentNode } from '@plugin/transformers';
import { flushProgress, reportProgress, resetProgress } from '@plugin/utils';

import type { ExportScope, ExternalLibrary } from '@ui/types';

const initializeExternalLibraries = (libraries: ExternalLibrary[]): void => {
  for (const library of libraries) {
    externalLibraries.set(library.name, library.uuid);
  }
};

export const handleExportMessage = async (
  scope: ExportScope,
  libraries: ExternalLibrary[],
  includeExternalVariables: boolean = false,
  skipDetection: boolean = false
): Promise<void> => {
  // Clear all state maps and caches to prevent memory accumulation
  clearAllState();
  resetProgress();

  let externalVars: Awaited<ReturnType<typeof detectExternalVariables>> = [];

  // Detect external variables before exporting
  // Skip detection only if user chose "Export as is" (skipDetection=true and includeExternalVariables=false)
  // Otherwise, we need to detect to either show warning or get IDs for inclusion
  if (!skipDetection || includeExternalVariables) {
    externalVars = await detectExternalVariables(figma.root, scope);

    // If external variables are detected and user hasn't chosen to include them, send warning
    // (only if not skipping detection - i.e., first time detecting)
    if (!skipDetection && externalVars.length > 0 && !includeExternalVariables) {
      const libraryNames = Array.from(
        new Set(
          externalVars.map(v => v.libraryName).filter((name): name is string => Boolean(name))
        )
      );

      reportProgress({
        type: 'EXTERNAL_VARIABLES_DETECTED',
        data: {
          variables: externalVars,
          libraryNames
        }
      });

      flushProgress();

      // Wait for user response - the export will be retried with includeExternalVariables=true or skipDetection=true
      return;
    }
  }

  initializeExternalLibraries(libraries);

  // Get external variable IDs if we should include them
  const externalVariableIds =
    includeExternalVariables && externalVars.length > 0
      ? externalVars.map(v => v.variableId)
      : undefined;

  const document = await transformDocumentNode(
    figma.root,
    scope,
    includeExternalVariables,
    externalVariableIds
  );

  flushProgress();

  reportProgress({
    type: 'PENPOT_DOCUMENT',
    data: document
  });
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

  reportProgress({
    type: 'RELOAD'
  });
};
