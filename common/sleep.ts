export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_YIELD_MS = 32;

let lastYieldTimestamp = 0;

// #region agent log
let yieldCount = 0;
let skipCount = 0;
// #endregion

export const yieldByTime = async (
  maxElapsedMs: number = DEFAULT_YIELD_MS,
  force: boolean = false
): Promise<void> => {
  const now = Date.now();
  const shouldYieldByTime = maxElapsedMs > 0 && now - lastYieldTimestamp >= maxElapsedMs;

  if (!shouldYieldByTime && !force) {
    // #region agent log
    skipCount++;
    // #endregion
    return;
  }

  // #region agent log
  yieldCount++;
  if (yieldCount % 50 === 0) {
    console.log('[DEBUG H5-yielding] Yield checkpoint', JSON.stringify({yieldCount,skipCount,elapsedSinceLastYield:now-lastYieldTimestamp}));
  }
  // #endregion

  await sleep(0);

  lastYieldTimestamp = now;
};
