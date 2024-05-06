import { PenpotFile } from '@ui/lib/penpot';
import { COMPONENT_TYPE } from '@ui/lib/types/component/componentAttributes';
import { ComponentShape } from '@ui/lib/types/component/componentShape';

import { createPenpotItem } from '.';

export const createPenpotComponent = (
  file: PenpotFile,
  { type, children = [], ...rest }: ComponentShape
) => {
  file.startComponent({ ...rest, type: COMPONENT_TYPE });

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.finishComponent();
};
