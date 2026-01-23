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
  // #region agent log
  const startTime = Date.now();
  console.log('[DEBUG H0-overview] Export started', JSON.stringify({scope,librariesCount:libraries.length}));
  // #endregion

  resetProgress();

  initializeExternalLibraries(libraries);

  // #region agent log
  try {
  // #endregion
    const document = await transformDocumentNode(figma.root, scope);

    // #region agent log
    const endTime = Date.now();
    console.log('[DEBUG H0-overview] Export completed successfully', JSON.stringify({durationMs:endTime-startTime,pagesCount:document.children?.length}));
    // #endregion

    flushProgress();

    reportProgress({
      type: 'PENPOT_DOCUMENT',
      data: document
    });
  // #region agent log
  } catch (error) {
    const errorTime = Date.now();
    console.log('[DEBUG H0-overview] Export failed with error', JSON.stringify({durationMs:errorTime-startTime,errorMessage:String(error),errorName:(error as Error)?.name}));
    throw error;
  }
  // #endregion
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
