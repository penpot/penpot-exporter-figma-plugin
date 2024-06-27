import { toObject } from '@common/map';

import { componentProperties as componentPropertiesLib, components } from '@plugin/libraries';
import {
  processImages,
  processPages,
  processPaintStyles,
  processTextStyles,
  registerPaintStyles,
  registerTextStyles
} from '@plugin/processors';

import { PenpotDocument } from '@ui/types';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  await registerPaintStyles();
  await registerTextStyles();

  const children = await processPages(node);
  const paintStyles = await processPaintStyles();
  const images = await processImages();
  const textStyles = await processTextStyles();
  const componentProperties = toObject(componentPropertiesLib);

  return {
    name: node.name,
    children,
    components: toObject(components),
    images,
    paintStyles,
    textStyles,
    componentProperties
  };
};
