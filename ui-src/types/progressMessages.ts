export type ProgressTotalItemsMessage = {
  type: 'PROGRESS_TOTAL_ITEMS';
  data: number;
};

export type ProgressProcessedItemsMessage = {
  type: 'PROGRESS_PROCESSED_ITEMS';
  data: number;
};

export type ProgressCurrentItemMessage = {
  type: 'PROGRESS_CURRENT_ITEM';
  data: string;
};

/**
 * Base progress message types (excluding PROGRESS_STEP which varies by context)
 */
export type BaseProgressMessage =
  | ProgressTotalItemsMessage
  | ProgressProcessedItemsMessage
  | ProgressCurrentItemMessage;

/**
 * Types that should be buffered (only the latest message of each type is kept)
 */
export const BUFFERED_PROGRESS_TYPES = [
  'PROGRESS_TOTAL_ITEMS',
  'PROGRESS_PROCESSED_ITEMS',
  'PROGRESS_CURRENT_ITEM'
] as const;

export type BufferedProgressType = (typeof BUFFERED_PROGRESS_TYPES)[number];
