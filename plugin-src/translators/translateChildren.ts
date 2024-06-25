import { remoteComponents } from '@plugin/libraries';
import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';
import { transformMaskFigmaIds } from '@plugin/transformers/partials';
import { sleep } from '@plugin/utils';

import { PenpotNode } from '@ui/types';

/**
 * Translates the children of a node that acts as a mask.
 * We need to split the children into two groups: the ones that are masked and the ones that are not.
 *
 * The masked children will be grouped together in a mask group.
 * The unmasked children will be returned as they are.
 *
 * @maskIndex The index of the mask node in the children array
 */
export const translateMaskChildren = async (
  children: readonly SceneNode[],
  maskIndex: number
): Promise<PenpotNode[]> => {
  const maskChild = children[maskIndex];

  const unmaskedChildren = await translateChildren(children.slice(0, maskIndex));
  const maskedChildren = await translateChildren(children.slice(maskIndex));

  if (
    maskChild.type === 'STICKY' ||
    maskChild.type === 'CONNECTOR' ||
    maskChild.type === 'CODE_BLOCK' ||
    maskChild.type === 'WIDGET' ||
    maskChild.type === 'EMBED' ||
    maskChild.type === 'LINK_UNFURL' ||
    maskChild.type === 'MEDIA' ||
    maskChild.type === 'SECTION' ||
    maskChild.type === 'TABLE' ||
    maskChild.type === 'SHAPE_WITH_TEXT'
  ) {
    return [...unmaskedChildren, ...maskedChildren];
  }

  const maskGroup = {
    ...transformMaskFigmaIds(maskChild),
    ...transformGroupNodeLike(maskChild),
    children: maskedChildren,
    maskedGroup: true
  };

  return [...unmaskedChildren, maskGroup];
};

export const translateChildren = async (children: readonly SceneNode[]): Promise<PenpotNode[]> => {
  const transformedChildren: PenpotNode[] = [];

  for (const child of children) {
    const penpotNode = await transformSceneNode(child);

    if (penpotNode) transformedChildren.push(penpotNode);

    await sleep(0);
  }

  return transformedChildren;
};

export const translateRemoteChildren = async (): Promise<PenpotNode[]> => {
  const transformedChildren: PenpotNode[] = [];
  let currentRemote = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'remote'
  });

  while (remoteComponents.remaining() > 0) {
    figma.ui.postMessage({
      type: 'PROGRESS_TOTAL_ITEMS',
      data: remoteComponents.total()
    });

    const child = remoteComponents.next();

    const penpotNode = await transformSceneNode(child);

    if (penpotNode) transformedChildren.push(penpotNode);

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentRemote++
    });

    await sleep(0);
  }

  return transformedChildren;
};
