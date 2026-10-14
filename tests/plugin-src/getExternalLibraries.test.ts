import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sendExternalLibraries } from '@plugin/getExternalLibraries';

const mockPostMessage = vi.fn();
const mockFindAllWithCriteria = vi.fn();
const mockGetVariableCollections = vi.fn();

const instanceOf = (mainComponent: { remote: boolean; figmaFile: string } | null): unknown => ({
  getMainComponentAsync: async (): Promise<unknown> =>
    mainComponent && {
      remote: mainComponent.remote,
      getPluginData: (key: string): string => (key === 'figmaFile' ? mainComponent.figmaFile : '')
    }
});

describe('sendExternalLibraries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockFindAllWithCriteria.mockReturnValue([]);
    mockGetVariableCollections.mockResolvedValue([]);

    (globalThis as { figma?: typeof figma }).figma = {
      editorType: 'figma',
      ui: { postMessage: mockPostMessage },
      loadAllPagesAsync: vi.fn().mockResolvedValue(undefined),
      root: { findAllWithCriteria: mockFindAllWithCriteria },
      teamLibrary: { getAvailableLibraryVariableCollectionsAsync: mockGetVariableCollections }
    } as unknown as typeof figma;
  });

  it('detects libraries that only publish components', async () => {
    mockFindAllWithCriteria.mockReturnValue([
      instanceOf({ remote: true, figmaFile: 'Design System' }),
      instanceOf({ remote: true, figmaFile: 'Design System' }),
      instanceOf({ remote: false, figmaFile: 'Local File' }),
      instanceOf({ remote: true, figmaFile: '' }),
      instanceOf(null)
    ]);

    await sendExternalLibraries();

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'EXTERNAL_LIBRARIES',
      data: ['Design System']
    });
  });

  it('merges component and variable libraries without duplicates', async () => {
    mockFindAllWithCriteria.mockReturnValue([
      instanceOf({ remote: true, figmaFile: 'Design System' })
    ]);
    mockGetVariableCollections.mockResolvedValue([
      { libraryName: 'Design System' },
      { libraryName: 'Tokens' }
    ]);

    await sendExternalLibraries();

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'EXTERNAL_LIBRARIES',
      data: ['Design System', 'Tokens']
    });
  });

  it('still sends component libraries when the team library request fails', async () => {
    mockFindAllWithCriteria.mockReturnValue([
      instanceOf({ remote: true, figmaFile: 'Design System' })
    ]);
    mockGetVariableCollections.mockRejectedValue(new Error('offline'));

    await sendExternalLibraries();

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'EXTERNAL_LIBRARIES',
      data: ['Design System']
    });
  });
});
