import { PenpotFile } from '@ui/lib/types/penpotFile';
import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { Uuid } from '@ui/lib/types/utils/uuid';
import { translateUiBlendMode } from '@ui/translators';

import { createPenpotItem } from '.';

export const createPenpotGroup = (
  file: PenpotFile,
  { type, blendMode, children = [], ...rest }: GroupShape
): Uuid => {
  const id = file.addGroup({
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeGroup();

  return id;
};
