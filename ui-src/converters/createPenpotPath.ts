import { PenpotFile } from '@ui/lib/penpot';
import { PATH_TYPE } from '@ui/lib/types/path/pathAttributes';
import { PathShape } from '@ui/lib/types/path/pathShape';
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
    type: PATH_TYPE,
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    content: translatePathContent(content),
    ...rest
  });
};
