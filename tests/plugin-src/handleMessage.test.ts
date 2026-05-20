import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { handleExportMessage as HandleExportMessageFn } from '@plugin/handleMessage';
import type * as PluginUtils from '@plugin/utils';

const mockPostMessage = vi.fn();
const mockTransformDocumentNode = vi.fn();
const mockTransformSlidesDocumentNode = vi.fn();
const mockIsSlidesEditor = vi.fn().mockReturnValue(false);

vi.mock('@plugin/transformers', () => ({
  transformDocumentNode: mockTransformDocumentNode,
  transformSlidesDocumentNode: mockTransformSlidesDocumentNode
}));

vi.mock('@plugin/utils', async () => {
  const actual = await vi.importActual<typeof PluginUtils>('@plugin/utils');
  return {
    ...actual,
    isSlidesEditor: (): boolean => mockIsSlidesEditor()
  };
});

(globalThis as { figma?: typeof figma }).figma = {
  ui: { postMessage: mockPostMessage },
  root: {} as typeof figma.root
} as unknown as typeof figma;

describe('handleExportMessage', () => {
  let handleExportMessage: typeof HandleExportMessageFn;

  beforeEach(async () => {
    vi.resetModules();
    mockPostMessage.mockClear();
    mockTransformDocumentNode.mockReset();
    mockTransformSlidesDocumentNode.mockReset();
    mockIsSlidesEditor.mockReturnValue(false);

    const module = await import('@plugin/handleMessage');
    handleExportMessage = module.handleExportMessage;
  });

  it('posts PENPOT_DOCUMENT on success', async () => {
    mockTransformDocumentNode.mockResolvedValue({ name: 'doc' });

    await handleExportMessage('all', []);

    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'PENPOT_DOCUMENT' })
    );
  });

  it('posts ERROR when transformer throws', async () => {
    mockTransformDocumentNode.mockRejectedValue(new Error('boom'));

    await handleExportMessage('all', []);

    const errorCalls = mockPostMessage.mock.calls.filter(([msg]) => msg.type === 'ERROR');
    expect(errorCalls).toHaveLength(1);
    expect(errorCalls[0][0]).toEqual({
      type: 'ERROR',
      data: expect.objectContaining({
        message: 'boom',
        origin: 'plugin',
        stack: expect.any(String)
      })
    });
  });

  it('posts ERROR with string when non-Error thrown', async () => {
    mockTransformDocumentNode.mockRejectedValue('plain string failure');

    await handleExportMessage('all', []);

    const errorCalls = mockPostMessage.mock.calls.filter(([msg]) => msg.type === 'ERROR');
    expect(errorCalls).toHaveLength(1);
    expect(errorCalls[0][0]).toEqual({
      type: 'ERROR',
      data: expect.objectContaining({
        message: 'plain string failure',
        origin: 'plugin',
        stack: undefined
      })
    });
  });

  it('routes to slides transformer when editor is slides', async () => {
    mockIsSlidesEditor.mockReturnValue(true);
    mockTransformSlidesDocumentNode.mockResolvedValue({ name: 'slides-doc' });

    await handleExportMessage('all', []);

    expect(mockTransformSlidesDocumentNode).toHaveBeenCalled();
    expect(mockTransformDocumentNode).not.toHaveBeenCalled();
  });
});
