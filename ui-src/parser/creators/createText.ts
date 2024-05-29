import { PenpotFile } from '@ui/lib/types/penpotFile';
import { TextShape } from '@ui/lib/types/shapes/textShape';
import { symbolBlendMode } from '@ui/parser/creators/symbols';

export const createPenpotText = (file: PenpotFile, { type, blendMode, ...rest }: TextShape) => {
  file.createText({
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });
};
