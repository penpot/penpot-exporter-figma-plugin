import type { PenpotContext } from '@ui/lib/types/penpotContext';
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
} from '@ui/parser/creators';
import type { PenpotNode } from '@ui/types';

export const createItems = (context: PenpotContext, nodes: PenpotNode[]): void => {
  for (const node of nodes) {
    createItem(context, node);
  }
};

const createItem = (context: PenpotContext, node: PenpotNode): void => {
  switch (node.type) {
    case 'rect':
      return createRectangle(context, node);
    case 'circle':
      return createCircle(context, node);
    case 'frame':
      createArtboard(context, node);

      return;
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
