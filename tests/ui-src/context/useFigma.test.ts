// @vitest-environment happy-dom
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFigma } from '@ui/context/useFigma';
import { fileSizeInMB } from '@ui/utils';

const { track, identify, captureException, parse, exportStream, sendMessage, getBlob, writable } =
  vi.hoisted(() => ({
    track: vi.fn(),
    identify: vi.fn(),
    captureException: vi.fn(),
    parse: vi.fn(),
    exportStream: vi.fn(),
    sendMessage: vi.fn(),
    getBlob: vi.fn(),
    writable: {} as WritableStream
  }));

vi.mock('@ui/metrics/mixpanel', () => ({ track, identify }));
vi.mock('@sentry/react', () => ({ captureException }));
vi.mock('@ui/parser', () => ({ parse }));
vi.mock('@penpot/library', () => ({ exportStream }));
vi.mock('@ui/context', () => ({
  sendMessage,
  createInMemoryWritable: (): { writable: WritableStream; getBlob: typeof getBlob } => ({
    writable,
    getBlob
  })
}));

type PluginEventData = { type: string; data?: unknown };

const dispatchPluginMessage = (data: PluginEventData): void => {
  window.dispatchEvent(new MessageEvent('message', { data: { pluginMessage: data } }));
};

// Lets the async PENPOT_DOCUMENT handler run through its awaited mocks.
const flushAsyncHandlers = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

const mountedContainers: HTMLElement[] = [];

const unmountContainer = (container: HTMLElement): void => {
  act(() => render(null, container));
};

type HookResult<T> = { result: { current: T }; unmount: () => void };

const renderHook = <T>(hook: () => T): HookResult<T> => {
  const result = { current: undefined as T };
  const container = document.createElement('div');
  const HookHost = (): null => {
    result.current = hook();
    return null;
  };

  mountedContainers.push(container);
  act(() => render(h(HookHost, null), container));

  return { result, unmount: (): void => unmountContainer(container) };
};

describe('useFigma', () => {
  let postMessage: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    getBlob.mockReturnValue(new Blob(['test data']));
    exportStream.mockResolvedValue(undefined);
    parse.mockResolvedValue({});
    postMessage = vi.spyOn(window.parent, 'postMessage').mockImplementation((): void => {});
  });

  afterEach(() => {
    // Unmount even when an assertion failed, so window listeners never leak between tests.
    mountedContainers.splice(0).forEach(unmountContainer);
    postMessage.mockRestore();
    vi.restoreAllMocks();
  });

  it('sets a UI error and tracks it without sending it to Sentry', () => {
    const { result, unmount } = renderHook(() => useFigma());

    act(() => {
      window.dispatchEvent(new ErrorEvent('error', { message: 'Boom', error: new Error('Boom') }));
    });

    expect(result.current.error).toMatchObject({ message: 'Boom', origin: 'ui' });
    expect(result.current.exporting).toBe(false);
    expect(track).toHaveBeenCalledWith(
      'Error',
      expect.objectContaining({
        'Error Message': 'Boom',
        'Error Origin': 'ui',
        'Error Step': 'idle'
      })
    );
    expect(captureException).not.toHaveBeenCalled();
    unmount();
  });

  it('ignores benign window errors without changing export state', () => {
    const { result, unmount } = renderHook(() => useFigma());
    act(() => result.current.exportPenpot({ externalLibraries: [] }));
    expect(result.current.exporting).toBe(true);

    act(() => {
      window.dispatchEvent(
        new ErrorEvent('error', {
          message: 'ResizeObserver loop completed with undelivered notifications.'
        })
      );
    });

    expect(result.current.error).toBeNull();
    expect(result.current.exporting).toBe(true);
    expect(track).not.toHaveBeenCalledWith('Error', expect.anything());
    unmount();
  });

  it('tracks unhandled promise rejections', () => {
    const { result, unmount } = renderHook(() => useFigma());
    const event = new Event('unhandledrejection');
    Object.defineProperty(event, 'reason', { value: new Error('Async boom') });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.error).toMatchObject({
      message: 'Async boom',
      origin: 'unhandled-rejection'
    });
    expect(track).toHaveBeenCalledWith(
      'Error',
      expect.objectContaining({
        'Error Message': 'Async boom',
        'Error Origin': 'unhandled-rejection'
      })
    );
    unmount();
  });

  it('sends unexpected plugin errors to Sentry', () => {
    const { unmount } = renderHook(() => useFigma());

    act(() => {
      dispatchPluginMessage({
        type: 'ERROR',
        data: { message: 'Plugin boom', origin: 'plugin', expected: false }
      });
    });

    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Plugin boom' }),
      expect.objectContaining({ tags: expect.objectContaining({ errorOrigin: 'plugin' }) })
    );
    unmount();
  });

  it('identifies the user and tracks plugin loading', () => {
    const { unmount } = renderHook(() => useFigma());

    act(() => dispatchPluginMessage({ type: 'USER_DATA', data: { userId: 'u1' } }));

    expect(identify).toHaveBeenCalledWith({ userId: 'u1' });
    expect(track).toHaveBeenCalledWith('Plugin Loaded');
    unmount();
  });

  it('finishes document export and records the exported file size', async () => {
    const { result, unmount } = renderHook(() => useFigma());
    const now = vi.spyOn(Date, 'now').mockReturnValueOnce(100).mockReturnValueOnce(350);
    act(() => result.current.exportPenpot({ externalLibraries: [] }));

    await act(async () => {
      dispatchPluginMessage({ type: 'PENPOT_DOCUMENT', data: { name: 'My file' } });
      await flushAsyncHandlers();
    });

    expect(result.current.summary).toBe(true);
    expect(result.current.exporting).toBe(false);
    expect(result.current.exportedBlob).toEqual({
      blob: getBlob.mock.results[0].value,
      filename: 'My file.penpot'
    });
    expect(track).toHaveBeenCalledWith(
      'File Exported',
      expect.objectContaining({
        'Exported File Size': fileSizeInMB(getBlob.mock.results[0].value.size),
        'Exported File Size (bytes)': getBlob.mock.results[0].value.size,
        'Export Time (ms)': 250,
        'Export Time': expect.any(String)
      })
    );
    now.mockRestore();
    unmount();
  });

  it('tracks each new export step once with its index and elapsed time', () => {
    const { result, unmount } = renderHook(() => useFigma());
    const now = vi
      .spyOn(Date, 'now')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(125)
      .mockReturnValueOnce(180);

    act(() => result.current.exportPenpot({ externalLibraries: [] }));
    act(() => {
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'processing', total: 1 } });
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'processing', total: 1 } });
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'buildAssets', total: 1 } });
    });

    expect(track.mock.calls.filter(([event]) => event === 'File Export Step')).toEqual([
      [
        'File Export Step',
        { 'Export Step': 'processing', 'Export Step Index': 1, 'Export Elapsed Time (ms)': 25 }
      ],
      [
        'File Export Step',
        { 'Export Step': 'buildAssets', 'Export Step Index': 3, 'Export Elapsed Time (ms)': 80 }
      ]
    ]);
    now.mockRestore();
    unmount();
  });

  it('does not track progress steps outside an export', () => {
    const { unmount } = renderHook(() => useFigma());
    act(() =>
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'processing', total: 1 } })
    );
    expect(track).not.toHaveBeenCalledWith('File Export Step', expect.anything());
    unmount();
  });

  it('tracks the same step again after reload and a new export', () => {
    const { result, unmount } = renderHook(() => useFigma());
    const now = vi.spyOn(Date, 'now').mockReturnValue(100);
    act(() => result.current.exportPenpot({ externalLibraries: [] }));
    act(() =>
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'processing', total: 1 } })
    );
    act(() => dispatchPluginMessage({ type: 'RELOAD' }));
    act(() => result.current.exportPenpot({ externalLibraries: [] }));
    act(() =>
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'processing', total: 1 } })
    );
    expect(track.mock.calls.filter(([event]) => event === 'File Export Step')).toHaveLength(2);
    now.mockRestore();
    unmount();
  });

  it('uses the current export step for window errors', () => {
    const { result, unmount } = renderHook(() => useFigma());
    act(() => result.current.exportPenpot({ externalLibraries: [] }));
    act(() =>
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'buildAssets', total: 1 } })
    );
    act(() => {
      window.dispatchEvent(new ErrorEvent('error', { message: 'Boom' }));
    });
    expect(track).toHaveBeenCalledWith(
      'Error',
      expect.objectContaining({ 'Error Step': 'buildAssets' })
    );
    expect(result.current.error?.step).toBe('buildAssets');
    unmount();
  });

  it('continues tracking export steps and duration after a window error', async () => {
    const { result, unmount } = renderHook(() => useFigma());
    const now = vi
      .spyOn(Date, 'now')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(125)
      .mockReturnValueOnce(150)
      .mockReturnValueOnce(350);

    act(() => result.current.exportPenpot({ externalLibraries: [] }));
    act(() =>
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'processing', total: 1 } })
    );
    act(() => {
      window.dispatchEvent(new ErrorEvent('error', { message: 'Boom' }));
    });
    act(() =>
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'buildAssets', total: 1 } })
    );

    await act(async () => {
      dispatchPluginMessage({ type: 'PENPOT_DOCUMENT', data: { name: 'My file' } });
      await flushAsyncHandlers();
    });

    expect(track).toHaveBeenCalledWith(
      'File Export Step',
      expect.objectContaining({ 'Export Step': 'buildAssets' })
    );
    expect(track).toHaveBeenCalledWith(
      'File Exported',
      expect.objectContaining({ 'Export Time (ms)': 250 })
    );
    now.mockRestore();
    unmount();
  });

  it('uses the plugin error step over the current export step', () => {
    const { result, unmount } = renderHook(() => useFigma());
    act(() => result.current.exportPenpot({ externalLibraries: [] }));
    act(() =>
      dispatchPluginMessage({ type: 'PROGRESS_STEP', data: { step: 'processing', total: 1 } })
    );
    act(() =>
      dispatchPluginMessage({
        type: 'ERROR',
        data: { message: 'Plugin boom', origin: 'plugin', step: 'processAssets' }
      })
    );
    expect(track).toHaveBeenCalledWith(
      'Error',
      expect.objectContaining({ 'Error Step': 'processAssets' })
    );
    expect(result.current.error?.step).toBe('processAssets');
    unmount();
  });

  it('resets error and export state on reload', () => {
    const { result, unmount } = renderHook(() => useFigma());
    act(() => {
      window.dispatchEvent(new ErrorEvent('error', { message: 'Boom' }));
    });
    act(() => result.current.exportPenpot({ externalLibraries: [] }));

    act(() => dispatchPluginMessage({ type: 'RELOAD' }));

    expect(result.current.error).toBeNull();
    expect(result.current.summary).toBe(false);
    expect(result.current.exporting).toBe(false);
    expect(track).toHaveBeenCalledWith('Plugin Reloaded');
    unmount();
  });
});
