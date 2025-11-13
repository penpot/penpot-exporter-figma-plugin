import { sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import {
  optimizeFileMedias,
  registerColorLibraries,
  registerTypographyLibraries
} from '@ui/parser/builders';
import type { PenpotDocument } from '@ui/types';

export const buildAssets = async (
  context: PenpotContext,
  document: PenpotDocument
): Promise<void> => {
  const { images, paintStyles, textStyles } = document;

  const imagesToOptimize = Object.entries(images);
  const paintStylesToRegister = Object.entries(paintStyles);
  const textStylesToRegister = Object.entries(textStyles);

  sendMessage({
    type: 'PROGRESS_STEP',
    data: {
      step: 'buildAssets',
      total: imagesToOptimize.length + paintStylesToRegister.length + textStylesToRegister.length
    }
  });

  await optimizeFileMedias(context, imagesToOptimize, 1);
  await registerColorLibraries(context, paintStylesToRegister, imagesToOptimize.length + 1);
  await registerTypographyLibraries(
    context,
    textStylesToRegister,
    imagesToOptimize.length + paintStylesToRegister.length + 1
  );
};
