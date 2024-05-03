import { PenpotFile } from '@ui/lib/penpot';
import { GroupShape } from '@ui/lib/types/group/groupShape';
import { translateUiBlendMode } from '@ui/translators';

import { createPenpotItem } from '.';

export const createPenpotGroup = (
  file: PenpotFile,
  { type, blendMode, children = [], ...rest }: GroupShape
) => {
  file.addGroup({
    blendMode: translateUiBlendMode(blendMode),
    ...rest
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeGroup();
};
