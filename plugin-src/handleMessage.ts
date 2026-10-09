import { getDocumentPages } from '@plugin/getDocumentPages';
import {
  clearAllState,
  componentProperties,
  components,
  degradedLayers,
  externalLibraries,
  images,
  missingFonts,
  missingPageIds,
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
  resetProgress,
  setExportOptions
} from '@plugin/utils';
import { ExpectedUserError } from '@plugin/utils/expectedUserError';
import { isFigmaPlatformError } from '@plugin/utils/figmaPlatformError';

import type {
  ErrorPayload,
  ExportOptions,
  ExportScope,
  ExternalLibrary,
  PenpotDocument
} from '@ui/types';

const initializeExternalLibraries = (libraries: ExternalLibrary[]): void => {
  for (const library of libraries) {
    externalLibraries.set(library.name, library.uuid);
  }
};

const buildDocument = async (scope: ExportScope, pageIds: string[]): Promise<PenpotDocument> => {
  if (isSlidesEditor()) return transformSlidesDocumentNode(figma.root);
  if (isFigJamEditor()) return transformFigJamDocumentNode(figma.root);
  return transformDocumentNode(figma.root, scope, pageIds);
};

const buildErrorPayload = (error: unknown): ErrorPayload => ({
  message:
    (error instanceof Error ? error.message : String(error)) +
    (isFigmaPlatformError(error)
      ? ' — This file triggers a Figma platform bug on large exports. Exporting page by page usually works.'
      : ''),
  stack: error instanceof Error ? error.stack : undefined,
  step: getCurrentStep(),
  layer: getCurrentItem(),
  origin: 'plugin',
  expected: error instanceof ExpectedUserError
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
  libraries: ExternalLibrary[],
  pageIds: string[] = [],
  options: ExportOptions = { backgroundBlur: false }
): Promise<void> => {
  try {
    // Clear all state maps and caches to prevent memory accumulation
    clearAllState();
    resetProgress();
    setExportOptions(options);

    initializeExternalLibraries(libraries);
    const document = await buildDocument(scope, pageIds);

    flushProgress();

    reportProgress({
      type: 'PENPOT_DOCUMENT',
      data: document
    });
  } catch (error) {
    flushProgress();
    postPluginError(error);

    if (error instanceof ExpectedUserError && !isSlidesEditor() && !isFigJamEditor()) {
      getDocumentPages();
    }
  }
};

export const handleRetryMessage = async (): Promise<void> => {
  try {
    resetProgress();
    missingFonts.clear();
    missingPageIds.clear();
    degradedLayers.clear();
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
