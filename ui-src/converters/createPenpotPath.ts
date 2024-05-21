import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PathShape } from '@ui/lib/types/shapes/pathShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import {
  translateFillGradients,
  translatePathContent,
  translateUiBlendMode
} from '@ui/translators';

export const createPenpotPath = (
  file: PenpotFile,
  { type, fills, blendMode, content, ...rest }: PathShape
): Uuid => {
  return file.createPath({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    content: translatePathContent(content),
    ...rest
  });
};
