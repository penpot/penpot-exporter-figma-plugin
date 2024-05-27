import { PenpotFile } from '@ui/lib/types/penpotFile';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { translateFillGradients, translateUiBlendMode } from '@ui/translators';

import { createPenpotItem } from '.';

export const createPenpotArtboard = (
  file: PenpotFile,
  { type, fills, blendMode, children = [], ...rest }: FrameShape
) => {
  file.addArtboard({
    fills: translateFillGradients(fills),
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeArtboard();
};
