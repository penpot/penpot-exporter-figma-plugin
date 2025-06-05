import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import { PenpotContext } from '@ui/lib/types/penpotContext';
import { TypographyStyle } from '@ui/lib/types/shapes/textShape';
import { typographies } from '@ui/parser';

export const registerTypographyLibraries = async (
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

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: stylesRegistered++
    });

    await sleep(0);
  }
};
