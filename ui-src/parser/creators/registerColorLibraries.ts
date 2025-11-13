import { yieldByTime } from '@common/sleep';

import { flushMessageQueue, sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { FillStyle } from '@ui/lib/types/utils/fill';
import { colors } from '@ui/parser';
import { symbolFillImage } from '@ui/parser/creators/symbols/symbolFills';

export const registerColorLibraries = async (
  context: PenpotContext,
  styles: Record<string, FillStyle>
): Promise<void> => {
  const stylesToRegister = Object.entries(styles);

  if (stylesToRegister.length === 0) return;

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'colorLibraries'
  });

  for (const [key, fillStyle] of stylesToRegister) {
    for (let index = 0; index < fillStyle.fills.length; index++) {
      const fill = fillStyle.fills[index];
      const color = fillStyle.colors[index];

      const colorId = context.addLibraryColor({
        ...color,
        color: fill.fillColor,
        opacity: fill.fillOpacity,
        image: fill.fillImage ? symbolFillImage(context, fill.fillImage) : undefined,
        gradient: fill.fillColorGradient
      });

      fillStyle.fills[index].fillColorRefId = colorId;
      fillStyle.fills[index].fillColorRefFile = context.currentFileId;
      fillStyle.colors[index].id = colorId;
      fillStyle.colors[index].refFile = context.currentFileId;
    }

    colors.set(key, fillStyle);

    await yieldByTime();
  }

  flushMessageQueue();
};
