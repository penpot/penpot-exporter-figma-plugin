import { Checkbox, Muted, SearchTextbox } from '@create-figma-plugin/ui';
import type { JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';

import { Stack } from '@ui/components/Stack';
import { useFigmaContext } from '@ui/context';

import styles from './PageSelector.module.css';

// Below this many pages the list is short enough to scan without searching.
const SEARCH_THRESHOLD = 8;

export const PageSelector = (): JSX.Element => {
  const { documentPages, selectedPageIds, setSelectedPageIds } = useFigmaContext();
  const [query, setQuery] = useState('');

  const selectedIds = useMemo(() => new Set(selectedPageIds), [selectedPageIds]);

  const visiblePages = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return documentPages;

    return documentPages.filter(page => page.name.toLowerCase().includes(term));
  }, [documentPages, query]);

  // Keeping the ids in document order means the export follows the same page
  // order as the Figma file, whatever order the boxes were ticked in.
  const inDocumentOrder = (ids: Set<string>): string[] =>
    documentPages.filter(page => ids.has(page.id)).map(page => page.id);

  const togglePage = (pageId: string, checked: boolean): void => {
    const nextIds = new Set(selectedPageIds);

    if (checked) {
      nextIds.add(pageId);
    } else {
      nextIds.delete(pageId);
    }

    setSelectedPageIds(inDocumentOrder(nextIds));
  };

  const selectAll = (): void => {
    // Both actions operate on the visible pages only, so searching narrows what
    // gets selected or cleared instead of wiping the rest of the selection.
    setSelectedPageIds(
      inDocumentOrder(new Set([...selectedPageIds, ...visiblePages.map(page => page.id)]))
    );
  };

  const clearAll = (): void => {
    const visibleIds = new Set(visiblePages.map(page => page.id));

    setSelectedPageIds(selectedPageIds.filter(id => !visibleIds.has(id)));
  };

  const hasVisiblePages = visiblePages.length > 0;
  const allVisibleSelected =
    hasVisiblePages && visiblePages.every(page => selectedIds.has(page.id));
  const someVisibleSelected = visiblePages.some(page => selectedIds.has(page.id));

  if (documentPages.length === 0) {
    return (
      <Stack space="2xsmall">
        <strong style={{ fontSize: 13 }}>Pages</strong>
        <Muted>Reading the pages of this document…</Muted>
      </Stack>
    );
  }

  return (
    <Stack space="2xsmall">
      <div className={styles.header}>
        <strong style={{ fontSize: 13 }}>Pages</strong>
        <span className={styles.count}>
          {selectedPageIds.length} of {documentPages.length} selected
        </span>
      </div>

      {documentPages.length > SEARCH_THRESHOLD && (
        <SearchTextbox
          placeholder="Search pages"
          value={query}
          onValueInput={setQuery}
          // The selector lives inside the export form; Enter must not submit it.
          onKeyDown={event => {
            if (event.key === 'Enter') event.preventDefault();
          }}
        />
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.action}
          onClick={selectAll}
          disabled={!hasVisiblePages || allVisibleSelected}
        >
          Select all
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={clearAll}
          disabled={!someVisibleSelected}
        >
          Clear
        </button>
      </div>

      <div className={styles.list}>
        {visiblePages.length === 0 ? (
          <span className={styles.empty}>No pages match &quot;{query}&quot;.</span>
        ) : (
          visiblePages.map(page => (
            <Checkbox
              key={page.id}
              value={selectedIds.has(page.id)}
              onValueChange={checked => togglePage(page.id, checked)}
            >
              <span className={styles.name} title={page.name}>
                {page.name}
              </span>
            </Checkbox>
          ))
        )}
      </div>

      {selectedPageIds.length === 0 && (
        <span className={styles.warning}>Select at least one page to export.</span>
      )}
    </Stack>
  );
};
