import {
  componentProperties,
  components,
  images,
  missingFonts,
  overrides,
  paintStyles,
  textStyles,
  variantProperties
} from '@plugin/libraries';
import { transformDocumentNode } from '@plugin/transformers';
import { flushProgress, reportProgress, resetProgress } from '@plugin/utils';

import type { ExportScope } from '@ui/types/progressMessages';

export const handleExportMessage = async (scope: ExportScope): Promise<void> => {
  resetProgress();
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
