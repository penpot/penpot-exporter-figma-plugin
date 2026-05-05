import { transformFrameNode } from '@plugin/transformers/transformFrameNode';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';
import type { PenpotNode } from '@ui/types/penpotNode';

// Penpot turns frames, components and instances into boards, and every board
// on a page becomes an entry point in presentation/prototype mode. Hide every
// nested artboard so only the slide root remains as the entry point.
const ARTBOARD_TYPES = new Set<ShapeBaseAttributes['type']>(['frame', 'component', 'instance']);

const hideDescendantArtboardsFromViewer = (children: PenpotNode[] | undefined): void => {
  if (!children) return;

  for (const child of children) {
    if (ARTBOARD_TYPES.has(child.type)) {
      (child as FrameShape).hideInViewer = true;
    }

    if ('children' in child) {
      hideDescendantArtboardsFromViewer(child.children);
    }
  }
};

export const transformSlideNode = async (node: SlideNode): Promise<FrameShape> => {
  const frame = await transformFrameNode(node as unknown as FrameNode);

  hideDescendantArtboardsFromViewer(frame.children);
  frame.hideInViewer = false;

  return frame;
};
