import { componentsLibrary } from '@plugin/ComponentLibrary';

import { PenpotDocument } from '@ui/types';

import { transformPageNode } from '.';

export const transformDocumentNode = async (node: DocumentNode): Promise<PenpotDocument> => {
  const children = [];
  let currentPage = 0;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_PAGES',
    data: node.children.length
  });

  for (const page of node.children) {
    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_PAGES',
      data: currentPage++
    });

    await page.loadAsync();

    children.push(await transformPageNode(page));
  }

  return {
    name: node.name,
    children,
    components: componentsLibrary.all()
  };
};
