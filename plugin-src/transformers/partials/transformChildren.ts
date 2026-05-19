import { translateChildren, translateMaskChildren } from '@plugin/translators';

import type { Children } from '@ui/lib/types/utils/children';
import type { PenpotNode } from '@ui/types/penpotNode';

const nodeActsAsMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};

let transformChildrenDepth = 0;

const deferToMacrotask = <T>(fn: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn().then(resolve).catch(reject);
    }, 0);
  });
};

export const transformChildren = async (node: ChildrenMixin): Promise<Children> => {
  const maskIndex = node.children.findIndex(nodeActsAsMask);
  const containsMask = maskIndex !== -1;

  transformChildrenDepth++;
  const currentDepth = transformChildrenDepth;

  // Break promise chain past depth 5 so GC can run between nested calls.
  const shouldDefer = currentDepth > 5;

  let children: PenpotNode[];

  const getChildren = (): Promise<PenpotNode[]> =>
    containsMask
      ? translateMaskChildren(node.children, maskIndex)
      : translateChildren(node.children);

  if (shouldDefer) {
    children = await deferToMacrotask(getChildren);
  } else {
    children = await getChildren();
  }

  transformChildrenDepth--;

  return { children };
};
