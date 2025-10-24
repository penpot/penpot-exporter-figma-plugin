import { toObject, toPlainObject } from '@common/map';

import { componentProperties, components, variantProperties } from '@plugin/libraries';
import {
  processImages,
  processPages,
  processPaintStyles,
  processTextStyles,
  processTokens,
  registerPaintStyles,
  registerTextStyles
} from '@plugin/processors';

import type { PenpotDocument } from '@ui/types';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const tokens = await processTokens();
  console.log(tokens);
  console.log(JSON.stringify(tokens, null, 2));

  await registerPaintStyles();
  await registerTextStyles();

  const children = await processPages(node);
  const paintStyles = await processPaintStyles();
  const images = await processImages();
  const textStyles = await processTextStyles();

  return {
    name: node.name,
    children,
    components: toObject(components),
    images,
    paintStyles,
    textStyles,
    componentProperties: toObject(componentProperties),
    variantProperties: toPlainObject(variantProperties)
  };
};
