import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { Blur } from '@ui/lib/types/utils/blur';
import { parseFigmaId } from '@ui/parser/parseFigmaId';

export const symbolBlur = (context: PenpotContext, blur: Blur | undefined): Blur | undefined => {
  if (!blur) return;

  const blurId = parseFigmaId(context);

  return {
    ...blur,
    id: blurId
  };
};
