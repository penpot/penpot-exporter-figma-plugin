import { componentsLibrary } from '@plugin/ComponentLibrary';
// @TODO: Direct import on purpose, to avoid problems with the tsc linting
import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { createFile } from '@ui/lib/penpot';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { FillStyle } from '@ui/lib/types/utils/fill';
import { buildFile } from '@ui/parser/creators';
import { symbolFillImage } from '@ui/parser/creators/symbols';
import { uiImages } from '@ui/parser/libraries';
import { uiColorLibraries } from '@ui/parser/libraries/UiColorLibraries';
import { PenpotDocument } from '@ui/types';

import { parseImage } from '.';

const optimizeImages = async (images: Record<string, Uint8Array>) => {
  const imagesToOptimize = Object.entries(images);

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
      uiImages.register(key, await parseImage(bytes));
    }

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: imagesOptimized++
    });

    await sleep(0);
  }
};

const prepareColorLibraries = async (file: PenpotFile, styles: Record<string, FillStyle>) => {
  const stylesToRegister = Object.entries(styles);

  if (stylesToRegister.length === 0) return;

  const stylesRegistered = 1;

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: stylesToRegister.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'format'
  });

  for (const [key, fillStyle] of stylesToRegister) {
    fillStyle.styles = fillStyle.styles.map(style => {
      const colorId = file.newId();
      const fillImage = style.fill.fillImage ? symbolFillImage(style.fill.fillImage) : undefined;

      return {
        fill: {
          ...style.fill,
          fillColorRefId: colorId,
          fillColorRefFile: file.getId(),
          fillImage
        },
        color: {
          ...style.color,
          refId: colorId,
          refFile: file.getId(),
          color: style.fill.fillColor,
          opacity: style.fill.fillOpacity,
          gradient: style.fill.fillColorGradient,
          image: fillImage
        }
      };
    });

    uiColorLibraries.register(key, fillStyle);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: stylesRegistered
    });

    await sleep(0);
  }
};

export const parse = async ({
  name,
  children = [],
  components,
  images,
  styles
}: PenpotDocument) => {
  componentsLibrary.init(components);

  const file = createFile(name);

  await optimizeImages(images);
  await prepareColorLibraries(file, styles);

  return buildFile(file, children);
};
