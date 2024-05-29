import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotNode } from '@ui/types';

import {
  createArtboard,
  createBool,
  createCircle,
  createComponent,
  createComponentInstance,
  createGroup,
  createPath,
  createRectangle,
  createText
} from '.';

export const createItems = (file: PenpotFile, nodes: PenpotNode[]) => {
  for (const node of nodes) {
    createItem(file, node);
  }
};

const createItem = (file: PenpotFile, node: PenpotNode) => {
  switch (node.type) {
    case 'rect':
      return createRectangle(file, node);
    case 'circle':
      return createCircle(file, node);
    case 'frame':
      return createArtboard(file, node);
    case 'group':
      return createGroup(file, node);
    case 'path':
      return createPath(file, node);
    case 'text':
      return createText(file, node);
    case 'bool':
      return createBool(file, node);
    case 'component':
      return createComponent(file, node);
    case 'instance':
      return createComponentInstance(file, node);
  }
};
