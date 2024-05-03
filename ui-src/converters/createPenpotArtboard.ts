import { PenpotFile } from '@ui/lib/penpot';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';

import { createPenpotItem } from '.';

export const createPenpotArtboard = (
  file: PenpotFile,
  { type, children = [], ...rest }: FrameShape
) => {
  file.addArtboard(rest);

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeArtboard();
};
