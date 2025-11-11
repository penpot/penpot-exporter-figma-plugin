import { toObject, toPlainObject } from '@common/map';

import {
  componentProperties,
  components,
  missingFonts,
  variantProperties
} from '@plugin/libraries';
import {
  processImages,
  processPages,
  processPaintStyles,
  processTextStyles,
  registerPaintStyles,
  registerTextStyles
} from '@plugin/processors';

import type { PenpotDocument } from '@ui/types';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  await registerPaintStyles();
  await registerTextStyles();

  const children = await processPages(node);
  const paintStyles = await processPaintStyles();
  const images = await processImages();
  const textStyles = await processTextStyles();

  return {
    name: node.name,
    children,
    images,
    paintStyles,
    textStyles,
    components: toObject(components),
    componentProperties: toObject(componentProperties),
    variantProperties: toPlainObject(variantProperties),
    missingFonts: Array.from(missingFonts)
  };
};
