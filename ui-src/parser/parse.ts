import { createBuildContext } from '@penpot/library';

import { init } from '@common/map';

import { PenpotContext } from '@ui/lib/types/penpotContext';
import { componentShapes, componentProperties as uiComponentProperties } from '@ui/parser';
import {
  buildFile,
  registerColorLibraries,
  registerFileMedias,
  registerTypographyLibraries
} from '@ui/parser/creators';
import { PenpotDocument } from '@ui/types';

export const parse = async ({
  name,
  children = [],
  components,
  images,
  paintStyles,
  textStyles,
  componentProperties
}: PenpotDocument): Promise<PenpotContext> => {
  init(componentShapes, components);
  init(uiComponentProperties, componentProperties);

  const context = createBuildContext();
  context.addFile({ name });

  await registerFileMedias(context, images);
  await registerColorLibraries(context, paintStyles);
  await registerTypographyLibraries(context, textStyles);

  return buildFile(context, children);
};
