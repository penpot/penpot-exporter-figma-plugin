import { remoteComponentLibrary } from '@plugin/RemoteComponentLibrary';
import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';
import { transformMaskFigmaIds } from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/shapes/groupShape';
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
export const translateMaskChildren = (
  children: readonly SceneNode[],
  maskIndex: number
): Promise<PenpotNode | undefined>[] => {
  const maskChild = children[maskIndex];

  const unmaskedChildren = translateChildren(children.slice(0, maskIndex));
  const maskedChildren = translateChildren(children.slice(maskIndex));

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

  const maskGroup = Promise.resolve<GroupShape>({
    ...transformMaskFigmaIds(maskChild),
    ...transformGroupNodeLike(maskChild),
    children: maskedChildren,
    maskedGroup: true
  });

  return [...unmaskedChildren, maskGroup];
};

export const translateChildren = (
  children: readonly SceneNode[]
): Promise<PenpotNode | undefined>[] => {
  const transformedChildren: Promise<PenpotNode | undefined>[] = [];

  for (const child of children) {
    transformedChildren.push(transformSceneNode(child));
  }

  return transformedChildren;
};

export const translateRemoteChildren = (): Promise<PenpotNode | undefined>[] => {
  const transformedChildren: Promise<PenpotNode | undefined>[] = [];
  let currentRemote = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'remote'
  });

  while (remoteComponentLibrary.remaining() > 0) {
    figma.ui.postMessage({
      type: 'PROGRESS_TOTAL_ITEMS',
      data: remoteComponentLibrary.total()
    });

    const child = remoteComponentLibrary.next();

    transformedChildren.push(transformSceneNode(child));

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentRemote++
    });
  }

  return transformedChildren;
};
