import { sendMessage } from '@ui/context';
import { PenpotContext } from '@ui/lib/types/penpotContext';
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

export const createItems = (context: PenpotContext, nodes: PenpotNode[]) => {
  for (const node of nodes) {
    createItem(context, node);
  }
};

const createItem = (context: PenpotContext, node: PenpotNode) => {
  sendMessage({
    type: 'PROGRESS_CURRENT_ITEM',
    data: node.name
  });

  switch (node.type) {
    case 'rect':
      return createRectangle(context, node);
    case 'circle':
      return createCircle(context, node);
    case 'frame':
      return createArtboard(context, node);
    case 'group':
      return createGroup(context, node);
    case 'path':
      return createPath(context, node);
    case 'text':
      return createText(context, node);
    case 'bool':
      return createBool(context, node);
    case 'component':
      return createComponent(context, node);
    case 'instance':
      return createComponentInstance(context, node);
  }
};
