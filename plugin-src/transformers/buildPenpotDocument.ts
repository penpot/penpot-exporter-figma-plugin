import { toObject } from '@common/map';

import {
  componentProperties,
  components,
  externalLibraries,
  missingFonts
} from '@plugin/libraries';
import { processAssets } from '@plugin/processors';
import { isSharedLibrary } from '@plugin/transformers';

import type { PenpotPage } from '@ui/lib/types/penpotPage';
import type { PenpotDocument } from '@ui/types';

export const buildPenpotDocument = async (
  name: string,
  children: PenpotPage[]
): Promise<PenpotDocument> => {
  const [paintStyles, textStyles] = await processAssets();

  return {
    name,
    children,
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
