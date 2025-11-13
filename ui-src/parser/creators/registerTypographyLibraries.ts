import { yieldByTime } from '@common/sleep';

import { flushMessageQueue, sendMessage } from '@ui/context';
import type { PenpotContext } from '@ui/lib/types/penpotContext';
import type { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import { typographies } from '@ui/parser';

export const registerTypographyLibraries = async (
  context: PenpotContext,
  styles: Record<string, TypographyStyle>
): Promise<void> => {
  const stylesToRegister = Object.entries(styles);

  if (stylesToRegister.length === 0) return;

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'typoLibraries'
  });

  for (const [key, style] of stylesToRegister) {
    const typography = style.typography;
    const textStyle = style.textStyle;

    const typographyId = context.addLibraryTypography({
      ...typography,
      fontId: textStyle.fontId,
      fontVariantId: textStyle.fontVariantId,
      letterSpacing: textStyle.letterSpacing,
      fontWeight: textStyle.fontWeight,
      fontStyle: textStyle.fontStyle,
      fontFamily: textStyle.fontFamily,
      fontSize: textStyle.fontSize,
      textTransform: textStyle.textTransform,
      lineHeight: textStyle.lineHeight
    });

    style.textStyle.typographyRefId = typographyId;
    style.textStyle.typographyRefFile = context.currentFileId;
    style.typography.id = typographyId;

    typographies.set(key, style);

    await yieldByTime();
  }

  flushMessageQueue();
};
