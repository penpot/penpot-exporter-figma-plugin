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
import { flushProgress, reportProgress } from '@plugin/utils';

export const handleExportMessage = async (): Promise<void> => {
  const document = await transformDocumentNode(figma.root);

  flushProgress();

  reportProgress({
    type: 'PENPOT_DOCUMENT',
    data: document
  });
};

export const handleRetryMessage = async (): Promise<void> => {
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
