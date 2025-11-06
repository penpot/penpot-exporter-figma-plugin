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

export const handleExportMessage = async (): Promise<void> => {
  figma.ui.postMessage({
    type: 'PENPOT_DOCUMENT',
    data: await transformDocumentNode(figma.root)
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

  figma.ui.postMessage({
    type: 'RELOAD'
  });
};
