import { toObject } from '@common/map';

import {
  componentProperties,
  components,
  externalLibraries,
  missingFonts
} from '@plugin/libraries';
import { processAssets, processSlides } from '@plugin/processors';
import { isSharedLibrary } from '@plugin/transformers';

import type { PenpotDocument } from '@ui/types';

export const transformSlidesDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const children = await processSlides(node);
  const [images, paintStyles, textStyles] = await processAssets();

  return {
    name: node.name,
    children,
    images,
    paintStyles,
    textStyles,
    tokens: undefined,
    components: toObject(components),
    componentProperties: toObject(componentProperties),
    externalLibraries: toObject(externalLibraries),
    missingFonts: Array.from(missingFonts),
    isShared: isSharedLibrary
  };
};
