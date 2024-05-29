import { PenpotFile } from '@ui/lib/types/penpotFile';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { symbolBlendMode } from '@ui/parser/creators/symbols';

import { createPenpotItem } from '.';

export const createGroup = (
  file: PenpotFile,
  { type, blendMode, children = [], ...rest }: GroupShape
) => {
  file.addGroup({
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeGroup();
};
