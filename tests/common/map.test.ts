import { describe, expect, it } from 'vitest';

import { init, toObject } from '@common/map';

describe('map utilities', () => {
  describe('toObject', () => {
    it('convierte Map vacío a objeto vacío', () => {
      const map = new Map<string, number>();
      expect(toObject(map)).toEqual({});
    });

    it('convierte Map con valores a objeto', () => {
      const map = new Map<string, number>();
      map.set('a', 1);
      map.set('b', 2);
      map.set('c', 3);
      expect(toObject(map)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('funciona con diferentes tipos de valores', () => {
      const map = new Map<string, string>();
      map.set('key1', 'value1');
      map.set('key2', 'value2');
      expect(toObject(map)).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('preserva el orden de inserción', () => {
      const map = new Map<string, number>();
      map.set('z', 26);
      map.set('a', 1);
      map.set('m', 13);
      const obj = toObject(map);
      const keys = Object.keys(obj);
      expect(keys).toEqual(['z', 'a', 'm']);
    });
  });

  describe('init', () => {
    it('inicializa Map vacío desde objeto vacío', () => {
      const map = new Map<string, number>();
      init(map, {});
      expect(map.size).toBe(0);
    });

    it('inicializa Map desde objeto con valores', () => {
      const map = new Map<string, number>();
      init(map, { a: 1, b: 2, c: 3 });
      expect(map.size).toBe(3);
      expect(map.get('a')).toBe(1);
      expect(map.get('b')).toBe(2);
      expect(map.get('c')).toBe(3);
    });

    it('limpia Map existente antes de inicializar', () => {
      const map = new Map<string, number>();
      map.set('old', 999);
      init(map, { a: 1, b: 2 });
      expect(map.size).toBe(2);
      expect(map.get('old')).toBeUndefined();
      expect(map.get('a')).toBe(1);
      expect(map.get('b')).toBe(2);
    });

    it('reemplaza valores existentes', () => {
      const map = new Map<string, number>();
      map.set('a', 100);
      init(map, { a: 1, b: 2 });
      expect(map.get('a')).toBe(1);
      expect(map.get('b')).toBe(2);
    });
  });
});
