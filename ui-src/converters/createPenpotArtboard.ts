import { PenpotFile } from '@ui/lib/types/penpotFile';
import { FrameShape } from '@ui/lib/types/shapes/frameShape';
import { Uuid } from '@ui/lib/types/utils/uuid';

import { createPenpotItem } from '.';

export const createPenpotArtboard = (
  file: PenpotFile,
  { type, children = [], ...rest }: FrameShape
): Uuid => {
  const id = file.addArtboard(rest);

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeArtboard();

  return id;
};
