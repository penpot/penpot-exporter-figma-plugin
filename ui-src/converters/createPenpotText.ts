import { PenpotFile } from '@ui/lib/types/penpotFile';
import { TextShape } from '@ui/lib/types/shapes/textShape';
import { translateUiBlendMode } from '@ui/translators';

export const createPenpotText = (file: PenpotFile, { type, blendMode, ...rest }: TextShape) => {
  file.createText({
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};
