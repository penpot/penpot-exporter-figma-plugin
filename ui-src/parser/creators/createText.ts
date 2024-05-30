import { PenpotFile } from '@ui/lib/types/penpotFile';
import { TextShape } from '@ui/lib/types/shapes/textShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode } from '@ui/parser/creators/symbols';

export const createText = (
  file: PenpotFile,
  { type, blendMode, figmaId, figmaRelatedId, ...rest }: TextShape
) => {
  file.createText({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });
};
