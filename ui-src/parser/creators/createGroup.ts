import { PenpotFile } from '@ui/lib/types/penpotFile';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { symbolBlendMode } from '@ui/parser/creators/symbols';

import { createItem } from '.';

export const createGroup = (
  file: PenpotFile,
  { type, blendMode, children = [], ...rest }: GroupShape
) => {
  file.addGroup({
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });

  for (const child of children) {
    createItem(file, child);
  }

  file.closeGroup();
};
