import { translateChildren, translateMaskChildren } from '@plugin/translators';

import type { Children } from '@ui/lib/types/utils/children';

const nodeActsAsMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};

// #region agent log
let transformChildrenDepth = 0;
// #endregion

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

  // #region agent log
  transformChildrenDepth++;
  const currentDepth = transformChildrenDepth;
  console.log('[DEBUG H8-fix] transformChildren depth', JSON.stringify({ depth: currentDepth, childrenCount: node.children.length }));
  // #endregion

  // For deeply nested structures (depth > 5), defer to a new macrotask
  // to break the promise chain and allow garbage collection
  const shouldDefer = currentDepth > 5;

  let children: Children['children'];

  if (shouldDefer) {
    // #region agent log
    console.log('[DEBUG H8-fix] Deferring to macrotask at depth', JSON.stringify({ depth: currentDepth }));
    // #endregion

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

  // #region agent log
  transformChildrenDepth--;
  console.log('[DEBUG H8-fix] transformChildren complete', JSON.stringify({ depth: currentDepth, childrenCount: children.length }));
  // #endregion

  return { children };
};
