import { PenpotFile } from '@ui/lib/penpot';
import { PenpotNode } from '@ui/lib/types/penpotNode';

import {
  createPenpotArtboard,
  createPenpotCircle,
  createPenpotGroup,
  createPenpotImage,
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
    case 'image':
      return createPenpotImage(file, node);
    case 'path':
      return createPenpotPath(file, node);
    case 'text':
      return createPenpotText(file, node);
  }
};
