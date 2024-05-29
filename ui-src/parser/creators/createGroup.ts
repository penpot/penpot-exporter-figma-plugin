import { PenpotFile } from '@ui/lib/types/penpotFile';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { symbolBlendMode } from '@ui/parser/creators/symbols';

import { createItems } from '.';

export const createGroup = (
  file: PenpotFile,
  { type, blendMode, children = [], ...rest }: GroupShape
) => {
  file.addGroup({
    blendMode: symbolBlendMode(blendMode),
    ...rest
  });

  createItems(file, children);

  file.closeGroup();
};
