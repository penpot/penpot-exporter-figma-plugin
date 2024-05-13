import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotNode } from '@ui/lib/types/penpotNode';

import {
  createPenpotArtboard,
  createPenpotCircle,
  createPenpotComponent,
  createPenpotGroup,
  createPenpotPath,
  createPenpotRectangle,
  createPenpotText
} from '.';

export const createPenpotItem = (file: PenpotFile, node: PenpotNode) => {
  switch (node.type) {
    case 'rect':
      return createPenpotRectangle(file, node);
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
