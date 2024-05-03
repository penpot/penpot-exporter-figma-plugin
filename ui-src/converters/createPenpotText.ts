import { PenpotFile } from '@ui/lib/penpot';
import { TextShape } from '@ui/lib/types/text/textShape';
import { translateUiBlendMode } from '@ui/translators';

export const createPenpotText = (file: PenpotFile, { type, blendMode, ...rest }: TextShape) => {
  file.createText({
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};
