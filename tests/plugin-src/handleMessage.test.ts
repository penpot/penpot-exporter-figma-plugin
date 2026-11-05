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
  root: { children: [] } as unknown as typeof figma.root,
  currentPage: { id: '1:1' } as PageNode
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

  it('marks expected user errors in the ERROR payload', async () => {
    const { ExpectedUserError } = await import('@plugin/utils/expectedUserError');
    mockTransformDocumentNode.mockRejectedValue(new ExpectedUserError('missing page'));

    await handleExportMessage('all', []);

    const errorCalls = mockPostMessage.mock.calls.filter(([msg]) => msg.type === 'ERROR');
    expect(errorCalls).toHaveLength(1);
    expect(errorCalls[0][0]).toEqual({
      type: 'ERROR',
      data: expect.objectContaining({
        message: 'missing page',
        origin: 'plugin',
        expected: true
      })
    });
    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'DOCUMENT_PAGES' })
    );
  });

  it('marks ordinary errors as unexpected in the ERROR payload', async () => {
    mockTransformDocumentNode.mockRejectedValue(new Error('boom'));

    await handleExportMessage('all', []);

    const errorCalls = mockPostMessage.mock.calls.filter(([msg]) => msg.type === 'ERROR');
    expect(errorCalls).toHaveLength(1);
    expect(errorCalls[0][0]).toEqual({
      type: 'ERROR',
      data: expect.objectContaining({
        message: 'boom',
        origin: 'plugin',
        expected: false
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

  it('forwards the selected page ids to the document transformer', async () => {
    mockTransformDocumentNode.mockResolvedValue({ name: 'doc' });

    await handleExportMessage('selection', [], ['1:1', '3:3']);

    expect(mockTransformDocumentNode).toHaveBeenCalledWith(expect.anything(), 'selection', [
      '1:1',
      '3:3'
    ]);
  });

  it('defaults to an empty page id list when none is provided', async () => {
    mockTransformDocumentNode.mockResolvedValue({ name: 'doc' });

    await handleExportMessage('all', []);

    expect(mockTransformDocumentNode).toHaveBeenCalledWith(expect.anything(), 'all', []);
  });

  it('applies the export options for the run', async () => {
    mockTransformDocumentNode.mockResolvedValue({ name: 'doc' });

    await handleExportMessage('all', [], [], { backgroundBlur: true });

    const { exportsBackgroundBlur } = await import('@plugin/utils');
    expect(exportsBackgroundBlur()).toBe(true);
  });

  it('defaults the export options to background blur off', async () => {
    mockTransformDocumentNode.mockResolvedValue({ name: 'doc' });

    await handleExportMessage('all', []);

    const { exportsBackgroundBlur } = await import('@plugin/utils');
    expect(exportsBackgroundBlur()).toBe(false);
  });

  it('routes to slides transformer when editor is slides', async () => {
    mockIsSlidesEditor.mockReturnValue(true);
    mockTransformSlidesDocumentNode.mockResolvedValue({ name: 'slides-doc' });

    await handleExportMessage('all', []);

    expect(mockTransformSlidesDocumentNode).toHaveBeenCalled();
    expect(mockTransformDocumentNode).not.toHaveBeenCalled();
  });
});
