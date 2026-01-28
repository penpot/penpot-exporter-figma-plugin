import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sleep, yieldByTime } from '@common/sleep';

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('espera el tiempo especificado', async () => {
    const promise = sleep(1000);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(1000);
    await promise;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('resuelve después del tiempo especificado', async () => {
    const promise = sleep(500);
    vi.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
  });

  it('maneja tiempo 0', async () => {
    const promise = sleep(0);
    vi.advanceTimersByTime(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it('maneja tiempos largos', async () => {
    const promise = sleep(10000);
    vi.advanceTimersByTime(10000);
    await expect(promise).resolves.toBeUndefined();
  });
});

describe('yieldByTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Date, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hace yield si ha pasado suficiente tiempo', async () => {
    const promise = yieldByTime(100);
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it('no hace yield si no ha pasado suficiente tiempo', async () => {
    // Primer yield
    await yieldByTime(100);
    vi.spyOn(Date, 'now').mockReturnValue(50);
    // Segundo yield antes del tiempo mínimo
    const promise = yieldByTime(100);
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it('hace yield si se fuerza aunque no haya pasado el tiempo', async () => {
    await yieldByTime(100);
    vi.spyOn(Date, 'now').mockReturnValue(50);
    const promise = yieldByTime(100, true);
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it('usa el tiempo por defecto si no se especifica', async () => {
    const promise = yieldByTime();
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it('no hace yield si maxElapsedMs es 0 y no se fuerza', async () => {
    const promise = yieldByTime(0, false);
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it('hace yield si maxElapsedMs es 0 pero se fuerza', async () => {
    const promise = yieldByTime(0, true);
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });
});
