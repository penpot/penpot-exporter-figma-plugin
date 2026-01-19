import type { TextSegment } from '@plugin/translators/text/paragraph/translateParagraphProperties';

export type ListType = 'ORDERED' | 'UNORDERED' | 'NONE';

export const getListType = (segment: TextSegment): ListType => segment.listOptions?.type ?? 'NONE';
