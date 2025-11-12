export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_YIELD_MS = 32;

let lastYieldTimestamp = 0;

export const yieldByTime = async (maxElapsedMs: number = DEFAULT_YIELD_MS): Promise<void> => {
  const now = Date.now();
  const shouldYieldByTime = maxElapsedMs > 0 && now - lastYieldTimestamp >= maxElapsedMs;

  if (!shouldYieldByTime) {
    return;
  }

  await sleep(0);

  lastYieldTimestamp = now;
};
