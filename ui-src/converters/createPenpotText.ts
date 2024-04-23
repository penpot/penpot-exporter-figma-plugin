import { PenpotFile } from '@ui/lib/penpot';
import { TEXT_TYPE } from '@ui/lib/types/text/textAttributes';
import { TextShape } from '@ui/lib/types/text/textShape';
import { translateUiBlendMode } from '@ui/translators';

export const createPenpotText = (file: PenpotFile, { type, blendMode, ...rest }: TextShape) => {
  file.createText({
    type: TEXT_TYPE,
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};
