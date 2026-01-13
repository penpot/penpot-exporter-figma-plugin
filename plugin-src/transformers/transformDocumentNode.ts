import { toObject } from '@common/map';

import {
  componentProperties,
  components,
  externalLibraries,
  missingFonts
} from '@plugin/libraries';
import {
  processPages,
  processTokens,
  registerPaintStyles,
  registerTextStyles
} from '@plugin/processors';
import { processAssets } from '@plugin/processors';
import { isSharedLibrary } from '@plugin/transformers';

import type { ExportScope, PenpotDocument } from '@ui/types';

export const transformDocumentNode = async (
  node: DocumentNode,
  scope: ExportScope
): Promise<PenpotDocument> => {
  const tokens = await processTokens();

  await registerPaintStyles();
  await registerTextStyles();

  const children = await processPages(node, scope);
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
    externalLibraries: toObject(externalLibraries),
    missingFonts: Array.from(missingFonts),
    isShared: isSharedLibrary
  };
};
