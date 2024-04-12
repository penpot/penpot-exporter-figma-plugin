import { PenpotFile } from '@ui/lib/penpot';
import { GROUP_TYPE } from '@ui/lib/types/group/groupAttributes';
import { GroupShape } from '@ui/lib/types/group/groupShape';

import { createPenpotItem } from '.';

export const createPenpotGroup = (
  file: PenpotFile,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { type, children = [], ...rest }: GroupShape
) => {
  file.addGroup({
    type: GROUP_TYPE,
    ...rest
  });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.closeGroup();
};
