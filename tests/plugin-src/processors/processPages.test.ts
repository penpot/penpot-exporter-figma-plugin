import { beforeEach, describe, expect, it, vi } from 'vitest';

import { processPages, selectPagesToProcess } from '@plugin/processors/processPages';
import { reportProgress } from '@plugin/utils';

import type { PluginMessage, ProgressCurrentPageMessage } from '@ui/types';

vi.mock('@plugin/transformers', () => ({
  transformPageNode: vi.fn(async (page: PageNode) => ({ name: page.name, children: [] }))
}));

vi.mock('@plugin/utils', () => ({
  reportProgress: vi.fn(),
  flushProgress: vi.fn()
}));

vi.mock('@common/sleep', () => ({
  yieldByTime: vi.fn(async () => {})
}));

const buildPage = (id: string, name: string): PageNode =>
  ({ id, name, loadAsync: vi.fn(async () => {}) }) as unknown as PageNode;

const pageOne = buildPage('1:1', 'Cover');
const pageTwo = buildPage('2:2', 'Components');
const pageThree = buildPage('3:3', 'Drafts');

const documentNode = {
  children: [pageOne, pageTwo, pageThree]
} as unknown as DocumentNode;

const reportedMessages = (): PluginMessage[] =>
  vi.mocked(reportProgress).mock.calls.map(([message]) => message);

const reportedPageNames = (): string[] =>
  reportedMessages()
    .filter(
      (message): message is ProgressCurrentPageMessage => message.type === 'PROGRESS_CURRENT_PAGE'
    )
    .map(message => message.data);

describe('selectPagesToProcess', () => {
  beforeEach(() => {
    (globalThis as { figma?: typeof figma }).figma = {
      currentPage: pageTwo
    } as unknown as typeof figma;
  });

  it('returns every page for the "all" scope', () => {
    expect(selectPagesToProcess(documentNode, 'all', [])).toEqual([pageOne, pageTwo, pageThree]);
  });

  it('ignores the page ids for the "all" scope', () => {
    expect(selectPagesToProcess(documentNode, 'all', ['1:1'])).toEqual([
      pageOne,
      pageTwo,
      pageThree
    ]);
  });

  it('returns only the current page for the "current" scope', () => {
    expect(selectPagesToProcess(documentNode, 'current', [])).toEqual([pageTwo]);
  });

  it('returns the selected pages for the "selection" scope', () => {
    expect(selectPagesToProcess(documentNode, 'selection', ['1:1', '3:3'])).toEqual([
      pageOne,
      pageThree
    ]);
  });

  it('keeps the document order regardless of the order of the ids', () => {
    expect(selectPagesToProcess(documentNode, 'selection', ['3:3', '1:1'])).toEqual([
      pageOne,
      pageThree
    ]);
  });

  it('ignores ids that no longer exist in the document', () => {
    expect(selectPagesToProcess(documentNode, 'selection', ['2:2', 'deleted'])).toEqual([pageTwo]);
  });

  it('throws when no selected page exists in the document', () => {
    expect(() => selectPagesToProcess(documentNode, 'selection', ['deleted'])).toThrow(
      /None of the selected pages/
    );
  });

  it('throws when the selection is empty', () => {
    expect(() => selectPagesToProcess(documentNode, 'selection', [])).toThrow(
      /None of the selected pages/
    );
  });
});

describe('processPages', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (globalThis as { figma?: typeof figma }).figma = {
      currentPage: pageTwo
    } as unknown as typeof figma;
  });

  it('reports the name of every page it processes', async () => {
    await processPages(documentNode, 'all', []);

    expect(reportedPageNames()).toEqual(['Cover', 'Components', 'Drafts']);
  });

  it('reports only the selected pages', async () => {
    await processPages(documentNode, 'selection', ['3:3', '1:1']);

    expect(reportedPageNames()).toEqual(['Cover', 'Drafts']);
  });

  it('reports the page name before the page is counted as processed', async () => {
    await processPages(documentNode, 'selection', ['1:1', '2:2']);

    expect(reportedMessages().map(message => message.type)).toEqual([
      'PROGRESS_STEP',
      'PROGRESS_CURRENT_PAGE',
      'PROGRESS_PROCESSED_ITEMS',
      'PROGRESS_CURRENT_PAGE',
      'PROGRESS_PROCESSED_ITEMS'
    ]);
  });
});
