import { createBuildContext } from '@penpot/library';

import { init } from '@common/map';

import { flushMessageQueue } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import { componentProperties, componentRoots, variantProperties } from '@ui/parser';
import {
  buildFile,
  createComponentsLibrary,
  registerColorLibraries,
  registerFileMedias,
  registerTypographyLibraries
} from '@ui/parser/creators';
import type { PenpotDocument } from '@ui/types';

export const parse = async ({
  name,
  children = [],
  components,
  images,
  paintStyles,
  textStyles,
  componentProperties: recordComponentProperties,
  variantProperties: recordVariantProperties
}: PenpotDocument): Promise<PenpotContext> => {
  init(componentRoots, components);
  init(componentProperties, recordComponentProperties);
  init(variantProperties, recordVariantProperties);

  const context = createBuildContext({ referer: `penpot-exporter-figma-plugin/${APP_VERSION}` });
  context.addFile({ name });

  await registerFileMedias(context, images);
  await registerColorLibraries(context, paintStyles);
  await registerTypographyLibraries(context, textStyles);
  await buildFile(context, children);
  await createComponentsLibrary(context);

  context.closeFile();

  flushMessageQueue();

  return context;
};
