type ProgressStepMessage = {
  type: 'PROGRESS_STEP';
  data: string;
};

type ProgressTotalItemsMessage = {
  type: 'PROGRESS_TOTAL_ITEMS';
  data: number;
};

type ProgressProcessedItemsMessage = {
  type: 'PROGRESS_PROCESSED_ITEMS';
  data: number;
};

type ProgressCurrentItemMessage = {
  type: 'PROGRESS_CURRENT_ITEM';
  data: string;
};

export type ProgressMessage =
  | ProgressStepMessage
  | ProgressTotalItemsMessage
  | ProgressProcessedItemsMessage
  | ProgressCurrentItemMessage;

type BufferedProgressType = Extract<
  ProgressMessage['type'],
  'PROGRESS_TOTAL_ITEMS' | 'PROGRESS_PROCESSED_ITEMS' | 'PROGRESS_CURRENT_ITEM'
>;

const BUFFERED_TYPES: Set<BufferedProgressType> = new Set([
  'PROGRESS_TOTAL_ITEMS',
  'PROGRESS_PROCESSED_ITEMS',
  'PROGRESS_CURRENT_ITEM'
]);

const progressBuffer = new Map<BufferedProgressType, ProgressMessage>();

const FLUSH_INTERVAL = 100;

let flushHandle: number | undefined;

const scheduleFlush = (): void => {
  if (flushHandle !== undefined) {
    return;
  }

  flushHandle = setTimeout(() => {
    flushHandle = undefined;
    flushProgress();
  }, FLUSH_INTERVAL) as unknown as number;
};

export const flushProgress = (): void => {
  if (flushHandle !== undefined) {
    clearTimeout(flushHandle);
    flushHandle = undefined;
  }

  if (progressBuffer.size === 0) {
    return;
  }

  for (const message of progressBuffer.values()) {
    figma.ui.postMessage(message);
  }

  progressBuffer.clear();
};

export const reportProgress = (message: ProgressMessage): void => {
  if (BUFFERED_TYPES.has(message.type as BufferedProgressType)) {
    progressBuffer.set(message.type as BufferedProgressType, message);
    scheduleFlush();

    return;
  }

  flushProgress();
  figma.ui.postMessage(message);
};
