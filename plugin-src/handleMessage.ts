import {
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
  libraries: ExternalLibrary[]
): Promise<void> => {
  resetProgress();

  initializeExternalLibraries(libraries);
  const document = await transformDocumentNode(figma.root, scope);

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
