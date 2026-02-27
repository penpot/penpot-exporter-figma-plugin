import { toObject } from '@common/map';

import {
  componentProperties,
  components,
  externalLibraries,
  missingFonts
} from '@plugin/libraries';
import {
  processAssets,
  processPages,
  processTokens,
  registerPaintStyles,
  registerTextStyles
} from '@plugin/processors';
import { type ExternalVariableInfo } from '@plugin/processors/detectExternalVariables';
import { mergeTokens, processExternalVariables } from '@plugin/processors/processExternalVariables';
import { isSharedLibrary } from '@plugin/transformers';

import type { ExportScope, PenpotDocument } from '@ui/types';

export const transformDocumentNode = async (
  node: DocumentNode,
  scope: ExportScope,
  externalVariablesToConvert?: ExternalVariableInfo[]
): Promise<PenpotDocument> => {
  // Process external variables FIRST so they're registered before local token processing
  // This allows local variables that alias to external variables to resolve correctly
  let externalTokens;
  if (externalVariablesToConvert && externalVariablesToConvert.length > 0) {
    externalTokens = await processExternalVariables(externalVariablesToConvert);
  }

  // Now process local tokens - aliases to external variables will resolve correctly
  const localTokens = await processTokens();

  // Merge local and external tokens
  const tokens = mergeTokens(localTokens, externalTokens);

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
