import { createBuildContext } from '@penpot/library';

import { init } from '@common/map';

import { flushMessageQueue } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import { componentProperties, componentRoots } from '@ui/parser';
import { buildAssets, buildComponentsLibrary, buildFile } from '@ui/parser/builders';
import type { PenpotDocument } from '@ui/types';

export const parse = async (document: PenpotDocument): Promise<PenpotContext> => {
  const {
    name,
    children = [],
    components,
    tokens,
    componentProperties: recordComponentProperties,
    externalLibraries,
    isShared
  } = document;

  init(componentRoots, components);
  init(componentProperties, recordComponentProperties);

  const context = createBuildContext({ referer: `penpot-exporter-figma-plugin/${APP_VERSION}` });
  const fileId = context.addFile({ name, isShared });

  await buildAssets(context, document);
  await buildFile(context, children);
  await buildComponentsLibrary(context);

  if (tokens) {
    context.addTokensLib(tokens);
  }

  context.closeFile();

  for (const [_, libraryId] of Object.entries(externalLibraries)) {
    if (libraryId !== '') {
      context.addRelation(fileId, libraryId);
    }
  }

  flushMessageQueue();

  return context;
};
