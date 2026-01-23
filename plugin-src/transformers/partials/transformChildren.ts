import { translateChildren, translateMaskChildren } from '@plugin/translators';

import type { Children } from '@ui/lib/types/utils/children';

const nodeActsAsMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};

/**
 * Tracks the current nesting depth to detect deeply nested structures.
 */
let transformChildrenDepth = 0;

/**
 * Defers execution to a new macrotask to break the promise chain.
 * This allows garbage collection to run between nested calls,
 * preventing memory accumulation in deeply nested structures.
 */
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

  // For deeply nested structures (depth > 5), defer to a new macrotask
  // to break the promise chain and allow garbage collection
  const shouldDefer = currentDepth > 5;

  let children: Children['children'];

  if (shouldDefer) {
    children = await deferToMacrotask(async () => {
      return containsMask
        ? await translateMaskChildren(node.children, maskIndex)
        : await translateChildren(node.children);
    });
  } else {
    children = containsMask
      ? await translateMaskChildren(node.children, maskIndex)
      : await translateChildren(node.children);
  }

  transformChildrenDepth--;

  return { children };
};
