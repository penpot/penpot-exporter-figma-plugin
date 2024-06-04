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

export const createItems = (file: PenpotFile, nodes: PenpotNode[], remote: boolean = false) => {
  for (const node of nodes) {
    createItem(file, node, remote);
  }
};

export const createItem = (file: PenpotFile, node: PenpotNode, remote: boolean = false) => {
  switch (node.type) {
    case 'rect':
      return createRectangle(file, node);
    case 'circle':
      return createCircle(file, node);
    case 'frame':
      return createArtboard(file, node, remote);
    case 'group':
      return createGroup(file, node, remote);
    case 'path':
      return createPath(file, node);
    case 'text':
      return createText(file, node);
    case 'bool':
      return createBool(file, node, remote);
    case 'component':
      return createComponent(file, node, remote);
    case 'instance':
      return createComponentInstance(file, node, remote);
  }
};
