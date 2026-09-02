import { reportProgress } from '@plugin/utils';

/**
 * Sends the page list to the UI so the user can pick which pages to export.
 *
 * With `documentAccess: dynamic-page` the page stubs in `figma.root.children`
 * expose `id` and `name` without loading their contents, so this is cheap even
 * on large documents.
 */
export const getDocumentPages = (): void => {
  reportProgress({
    type: 'DOCUMENT_PAGES',
    data: {
      pages: figma.root.children.map(page => ({
        id: page.id,
        name: page.name
      })),
      currentPageId: figma.currentPage.id
    }
  });
};
