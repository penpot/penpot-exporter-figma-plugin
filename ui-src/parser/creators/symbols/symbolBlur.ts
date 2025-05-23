import { PenpotContext } from '@ui/lib/types/penpotContext';
import { Blur } from '@ui/lib/types/utils/blur';

export const symbolBlur = (context: PenpotContext, blur: Blur | undefined): Blur | undefined => {
  if (!blur) return;

  const blurId = context.genId();

  return {
    ...blur,
    id: blurId
  };
};
