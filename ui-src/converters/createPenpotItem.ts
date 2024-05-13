import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotNode } from '@ui/lib/types/penpotNode';
import { Uuid } from '@ui/lib/types/utils/uuid';

import {
  createPenpotArtboard,
  createPenpotCircle,
  createPenpotComponent,
  createPenpotGroup,
  createPenpotPath,
  createPenpotRectangle,
  createPenpotText
} from '.';

export type Options = {
  componentId: Uuid;
  mainInstance: boolean;
};

export const createPenpotItem = (file: PenpotFile, node: PenpotNode, options?: Options) => {
  switch (node.type) {
    case 'rect':
      return createPenpotRectangle(file, node, options);
    case 'circle':
      return createPenpotCircle(file, node);
    case 'frame':
      return createPenpotArtboard(file, node);
    case 'group':
      return createPenpotGroup(file, node);
    case 'path':
      return createPenpotPath(file, node);
    case 'text':
      return createPenpotText(file, node);
    case 'component':
      return createPenpotComponent(file, node);
  }
};
