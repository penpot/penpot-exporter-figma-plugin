import { translateChildren, translateMaskChildren } from '@plugin/translators';

import type { LayoutChildAttributes } from '@ui/lib/types/shapes/layout';
import type { Children } from '@ui/lib/types/utils/children';
import type { PenpotNode } from '@ui/types/penpotNode';

const nodeActsAsMask = (node: SceneNode): boolean => {
  return 'isMask' in node && node.isMask;
};

const isAutoLayout = (node: ChildrenMixin): node is ChildrenMixin & AutoLayoutMixin => {
  return 'layoutMode' in node && 'itemReverseZIndex' in node;
};

const stacksFirstOnTop = (node: ChildrenMixin): boolean => {
  return (
    isAutoLayout(node) &&
    node.itemReverseZIndex &&
    (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL')
  );
};

/**
 * Penpot stacks layout children with the last one on top. When the Figma layout stacks the
 * first one on top, the z-index is reversed so overlapping children (negative gaps) render the same.
 * Absolute children are left out, Penpot always draws them above the rest.
 */
const reverseLayoutZIndex = (children: PenpotNode[]): void => {
  children.forEach((child, index) => {
    const layoutChild = child as LayoutChildAttributes;

    if (layoutChild.layoutItemAbsolute) return;

    layoutChild.layoutItemZIndex = children.length - 1 - index;
  });
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

  try {
    const getChildren = (): Promise<PenpotNode[]> =>
      containsMask
        ? translateMaskChildren(node.children, maskIndex)
        : translateChildren(node.children);

    const children = shouldDefer ? await deferToMacrotask(getChildren) : await getChildren();

    if (stacksFirstOnTop(node)) reverseLayoutZIndex(children);

    return { children };
  } finally {
    transformChildrenDepth--;
  }
};
