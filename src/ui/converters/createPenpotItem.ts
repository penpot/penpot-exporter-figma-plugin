import {
  createPenpotArtboard,
  createPenpotCircle,
  createPenpotGroup,
  createPenpotImage,
  createPenpotRectangle,
  createPenpotText
} from '.';
import { PenpotFile } from '../lib/penpot';
import { PenpotNode } from '../lib/types/penpotNode';

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
    case 'text':
      return createPenpotText(file, node);
  }
};
