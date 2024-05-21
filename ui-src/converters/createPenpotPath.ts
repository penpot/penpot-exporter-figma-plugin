import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import {
  translateFillGradients,
  translatePathContent,
  translateUiBlendMode
} from '@ui/translators';

export const createPenpotPath = (
  file: PenpotFile,
  { type, fills, blendMode, content, ...rest }: PathShape
) => {
  file.createPath({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    content: translatePathContent(content),
    ...rest
  });
};
