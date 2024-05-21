import { PenpotFile } from '@ui/lib/types/penpotFile';
import { TextShape } from '@ui/lib/types/shapes/textShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { translateUiBlendMode } from '@ui/translators';

export const createPenpotText = (
  file: PenpotFile,
  { type, blendMode, ...rest }: TextShape
): Uuid => {
  return file.createText({
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });
};
