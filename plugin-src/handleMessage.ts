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
import {
  transformDocumentNode,
  transformFigJamDocumentNode,
  transformSlidesDocumentNode
} from '@plugin/transformers';
import {
  flushProgress,
  getCurrentItem,
  getCurrentStep,
  isFigJamEditor,
  isSlidesEditor,
  reportProgress,
  resetProgress
} from '@plugin/utils';

import type { ErrorPayload, ExportScope, ExternalLibrary, PenpotDocument } from '@ui/types';

const initializeExternalLibraries = (libraries: ExternalLibrary[]): void => {
  for (const library of libraries) {
    externalLibraries.set(library.name, library.uuid);
  }
};

const buildDocument = async (scope: ExportScope): Promise<PenpotDocument> => {
  if (isSlidesEditor()) return transformSlidesDocumentNode(figma.root);
  if (isFigJamEditor()) return transformFigJamDocumentNode(figma.root);
  return transformDocumentNode(figma.root, scope);
};

const buildErrorPayload = (error: unknown): ErrorPayload => ({
  message: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined,
  step: getCurrentStep(),
  layer: getCurrentItem(),
  origin: 'plugin'
});

export const postPluginError = (error: unknown): void => {
  console.error('Penpot Exporter: unhandled error', error);
  figma.ui.postMessage({
    type: 'ERROR',
    data: buildErrorPayload(error)
  });
};

export const handleExportMessage = async (
  scope: ExportScope,
  libraries: ExternalLibrary[]
): Promise<void> => {
  try {
    // Clear all state maps and caches to prevent memory accumulation
    clearAllState();
    resetProgress();

    initializeExternalLibraries(libraries);
    const document = await buildDocument(scope);

    flushProgress();

    reportProgress({
      type: 'PENPOT_DOCUMENT',
      data: document
    });
  } catch (error) {
    flushProgress();
    postPluginError(error);
  }
};

export const handleRetryMessage = async (): Promise<void> => {
  try {
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
  } catch (error) {
    postPluginError(error);
  }
};
