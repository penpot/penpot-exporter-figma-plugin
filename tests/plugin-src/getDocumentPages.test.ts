import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getDocumentPages } from '@plugin/getDocumentPages';

const mockPostMessage = vi.fn();

describe('getDocumentPages', () => {
  beforeEach(() => {
    mockPostMessage.mockClear();

    (globalThis as { figma?: typeof figma }).figma = {
      ui: { postMessage: mockPostMessage },
      currentPage: { id: '2:2' },
      root: {
        children: [
          { id: '1:1', name: 'Cover' },
          { id: '2:2', name: 'Components' }
        ]
      }
    } as unknown as typeof figma;
  });

  it('posts the page list and the current page id', () => {
    getDocumentPages();

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'DOCUMENT_PAGES',
      data: {
        pages: [
          { id: '1:1', name: 'Cover' },
          { id: '2:2', name: 'Components' }
        ],
        currentPageId: '2:2'
      }
    });
  });
});
