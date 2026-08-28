import { yieldByTime } from '@common/sleep';

import { degradedLayers } from '@plugin/libraries';
import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';
import { transformMaskIds } from '@plugin/transformers/partials';
import { isFigmaPlatformError } from '@plugin/utils';

import type { PenpotNode } from '@ui/types';

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

  if (
    maskChild.type === 'STICKY' ||
    maskChild.type === 'CONNECTOR' ||
    maskChild.type === 'CODE_BLOCK' ||
    maskChild.type === 'WIDGET' ||
    maskChild.type === 'EMBED' ||
    maskChild.type === 'LINK_UNFURL' ||
    maskChild.type === 'MEDIA' ||
    maskChild.type === 'SECTION' ||
    maskChild.type === 'TABLE'
  ) {
    return await translateChildren(children);
  }

  const unmaskedChildren = await translateChildren(children.slice(0, maskIndex));
  const maskedChildren = await translateChildren(children.slice(maskIndex));

  const maskGroup = {
    ...transformMaskIds(maskChild),
    ...transformGroupNodeLike(maskChild),
    children: maskedChildren,
    maskedGroup: true
  };

  return [...unmaskedChildren, maskGroup];
};

export const translateChildren = async (children: readonly SceneNode[]): Promise<PenpotNode[]> => {
  const transformedChildren: PenpotNode[] = [];

  for (const child of children) {
    try {
      const penpotNode = await transformSceneNode(child);

      if (penpotNode) transformedChildren.push(penpotNode);
    } catch (error) {
      if (!isFigmaPlatformError(error)) throw error;

      const message = error instanceof Error ? error.message : String(error);

      console.error(
        `Penpot Exporter: skipped layer "${child.name}" due to a Figma platform error: ${message}`
      );
      degradedLayers.set(child.id, `${child.name}: skipped due to a Figma platform error`);
    }

    await yieldByTime();
  }

  return transformedChildren;
};
