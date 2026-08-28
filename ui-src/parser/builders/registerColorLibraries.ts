import { yieldByTime } from '@common/sleep';

import { flushMessageQueue, sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { FillStyle } from '@ui/lib/types/utils/fill';
import { colors } from '@ui/parser';
import { symbolFillImage } from '@ui/parser/creators/symbols/symbolFills';

export const registerColorLibraries = async (
  context: PenpotContext,
  stylesToRegister: [string, FillStyle][],
  currentAsset: number
): Promise<void> => {
  if (stylesToRegister.length === 0) return;

  let stylesRegistered = currentAsset;

  for (const [key, fillStyle] of stylesToRegister) {
    for (let index = 0; index < fillStyle.fills.length; index++) {
      const fill = fillStyle.fills[index];
      const color = fillStyle.colors[index];

      const image = fill.fillImage ? symbolFillImage(context, fill.fillImage) : undefined;

      // A color asset needs at least one of color, gradient or image; an entry can
      // end up with none (e.g. its image bytes could not be fetched) and would be
      // rejected by the Penpot library with "expected valid color".
      if (fill.fillColor === undefined && fill.fillColorGradient === undefined && !image) {
        console.warn(
          `Penpot Exporter: skipped color library entry "${color.name}" with no resolvable content`
        );
        continue;
      }

      const colorId = context.addLibraryColor({
        ...color,
        color: fill.fillColor,
        opacity: fill.fillOpacity,
        image,
        gradient: fill.fillColorGradient
      });

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

    await yieldByTime();
  }

  flushMessageQueue();

  await yieldByTime(undefined, true);
};
