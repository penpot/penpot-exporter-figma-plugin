import { LRUCache } from 'lru-cache';

const empty: unique symbol = Symbol('noValue');

// eslint-disable-next-line @typescript-eslint/ban-types
export class Cache<K extends {}, V extends {}> {
  private cache: LRUCache<K, V | typeof empty>;

  public constructor(options: LRUCache.Options<K, V | typeof empty, unknown>) {
    this.cache = new LRUCache(options);
  }

  public get(key: K, calculate: () => V | undefined): V | undefined {
    if (this.cache.has(key)) {
      const cacheItem = this.cache.get(key);

      return cacheItem === empty ? undefined : cacheItem;
    }

    const calculated = calculate();

    this.cache.set(key, calculated ?? empty);

    return calculated;
  }
}
