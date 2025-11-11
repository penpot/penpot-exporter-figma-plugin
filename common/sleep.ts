export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_YIELD_INTERVAL = 25;
const DEFAULT_YIELD_MS = 16;

let lastYieldTimestamp = 0;

export const yieldEvery = async (
  counter: number,
  interval: number = DEFAULT_YIELD_INTERVAL,
  maxElapsedMs: number = DEFAULT_YIELD_MS
): Promise<void> => {
  const shouldYieldByInterval =
    interval > 0 && counter !== 0 && counter % interval === 0;

  const now = Date.now();
  const shouldYieldByTime = maxElapsedMs > 0 && now - lastYieldTimestamp >= maxElapsedMs;

  if (!shouldYieldByInterval && !shouldYieldByTime) {
    return;
  }

  lastYieldTimestamp = now;
  await sleep(0);
  lastYieldTimestamp = Date.now();
};
