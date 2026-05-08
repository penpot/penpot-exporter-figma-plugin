import { transformFrameNode } from '@plugin/transformers/transformFrameNode';

import type { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import type { FrameShape } from '@ui/lib/types/shapes/frameShape';
import type { ComponentInstance } from '@ui/types/component';
import type { PenpotNode } from '@ui/types/penpotNode';

type Artboard = FrameShape | ComponentShape | ComponentInstance;

// Penpot turns frames, components and instances into boards, and every board
// on a page becomes an entry point in presentation/prototype mode. Hide every
// nested artboard so only the slide root remains as the entry point.
const isArtboard = (node: PenpotNode): node is Artboard =>
  node.type === 'frame' || node.type === 'component' || node.type === 'instance';

export const hideDescendantArtboardsFromViewer = (children: PenpotNode[] | undefined): void => {
  if (!children) return;

  for (const child of children) {
    if (isArtboard(child)) {
      child.hideInViewer = true;
    }

    if ('children' in child) {
      hideDescendantArtboardsFromViewer(child.children);
    }
  }
};

export const transformSlideNode = async (node: SlideNode): Promise<FrameShape> => {
  const frame = await transformFrameNode(node as unknown as FrameNode);

  hideDescendantArtboardsFromViewer(frame.children);
  frame.hideInViewer = node.isSkippedSlide;

  return frame;
};
