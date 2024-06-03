import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { parseFigmaId } from '@ui/parser';
import { symbolBlendMode, symbolFills, symbolPathContent } from '@ui/parser/creators/symbols';

export const createPath = (
  file: PenpotFile,
  { type, fills, blendMode, content, figmaId, figmaRelatedId, ...rest }: PathShape
) => {
  file.createPath({
    id: parseFigmaId(file, figmaId),
    shapeRef: parseFigmaId(file, figmaRelatedId, true),
    fills: symbolFills(fills),
    blendMode: symbolBlendMode(blendMode),
    content: symbolPathContent(content),
    ...rest
  });
};
