import { toObject } from '@common/map';

import { componentProperties, components, missingFonts } from '@plugin/libraries';
import {
  processPages,
  processTokens,
  registerPaintStyles,
  registerTextStyles
} from '@plugin/processors';
import { processAssets } from '@plugin/processors/processAssets';

import type { PenpotDocument } from '@ui/types';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const tokens = await processTokens();

  await registerPaintStyles();
  await registerTextStyles();

  const children = await processPages(node);
  const [images, paintStyles, textStyles] = await processAssets();

  return {
    name: node.name,
    children,
    images,
    paintStyles,
    textStyles,
    tokens,
    components: toObject(components),
    componentProperties: toObject(componentProperties),
    missingFonts: Array.from(missingFonts)
  };
};
