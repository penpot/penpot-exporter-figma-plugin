import { createBuildContext } from '@penpot/library';

import { init } from '@common/map';
import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import { PenpotContext } from '@ui/lib/types/penpotContext';
import { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import { FillStyle } from '@ui/lib/types/utils/fill';
import {
  colors,
  componentShapes,
  images,
  typographies,
  componentProperties as uiComponentProperties
} from '@ui/parser';
import { buildFile } from '@ui/parser/creators';
import { PenpotDocument } from '@ui/types';

import { parseImage } from '.';

const optimizeImages = async (context: PenpotContext, binaryImages: Record<string, Uint8Array>) => {
  const imagesToOptimize = Object.entries(binaryImages);

  if (imagesToOptimize.length === 0) return;

  let imagesOptimized = 1;

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: imagesToOptimize.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'optimization'
  });

  for (const [key, bytes] of imagesToOptimize) {
    if (bytes) {
      images.set(key, await parseImage(context, key, bytes));
    }

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: imagesOptimized++
    });

    await sleep(0);
  }
};

const prepareTypographyLibraries = async (
  context: PenpotContext,
  styles: Record<string, TypographyStyle>
) => {
  const stylesToRegister = Object.entries(styles);

  if (stylesToRegister.length === 0) return;

  let stylesRegistered = 1;

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: stylesToRegister.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'typoFormat'
  });

  for (const [key, style] of stylesToRegister) {
    const typographyId = context.genId();
    style.textStyle.typographyRefId = typographyId;
    style.textStyle.typographyRefFile = context.currentFileId;
    style.typography.id = typographyId;

    typographies.set(key, style);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: stylesRegistered++
    });

    await sleep(0);
  }
};

const prepareColorLibraries = async (context: PenpotContext, styles: Record<string, FillStyle>) => {
  const stylesToRegister = Object.entries(styles);

  if (stylesToRegister.length === 0) return;

  let stylesRegistered = 1;

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: stylesToRegister.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'format'
  });

  for (const [key, fillStyle] of stylesToRegister) {
    for (let index = 0; index < fillStyle.fills.length; index++) {
      const colorId = context.genId();
      fillStyle.fills[index].fillColorRefId = colorId;
      fillStyle.fills[index].fillColorRefFile = context.currentFileId;
      fillStyle.colors[index].id = colorId;
      fillStyle.colors[index].refFile = context.currentFileId;
    }

    colors.set(key, fillStyle);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: stylesRegistered++
    });

    await sleep(0);
  }
};

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

  await optimizeImages(context, images);
  await prepareColorLibraries(context, paintStyles);
  await prepareTypographyLibraries(context, textStyles);

  return buildFile(context, children);
};
