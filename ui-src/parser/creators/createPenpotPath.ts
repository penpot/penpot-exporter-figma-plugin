import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import {
  symbolBlendMode,
  symbolFillGradients,
  symbolPathContent
} from '@ui/parser/creators/symbols';

export const createPenpotPath = (
  file: PenpotFile,
  { type, fills, blendMode, content, ...rest }: PathShape
) => {
  file.createPath({
    fills: symbolFillGradients(fills),
    blendMode: symbolBlendMode(blendMode),
    content: symbolPathContent(content),
    ...rest
  });
};
