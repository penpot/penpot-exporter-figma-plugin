import { toObject } from '@common/map';

import { componentProperties, components, instances } from '@plugin/libraries';
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

  return {
    name: node.name,
    children,
    components: toObject(components),
    images,
    instances: toObject(instances),
    paintStyles,
    textStyles,
    componentProperties: toObject(componentProperties)
  };
};
