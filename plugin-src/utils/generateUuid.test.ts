import { describe, expect, it } from 'vitest';

import { generateDeterministicUuid, generateUuid } from './generateUuid';

describe('generateUuid', () => {
  it('genera un UUID válido', () => {
    const uuid = generateUuid();
    // Formato UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('genera UUIDs diferentes en cada llamada', () => {
    const uuid1 = generateUuid();
    const uuid2 = generateUuid();
    const uuid3 = generateUuid();
    expect(uuid1).not.toBe(uuid2);
    expect(uuid2).not.toBe(uuid3);
    expect(uuid1).not.toBe(uuid3);
  });

  it('genera UUIDs con longitud correcta', () => {
    const uuid = generateUuid();
    // UUID tiene 36 caracteres (32 hex + 4 guiones)
    expect(uuid.length).toBe(36);
  });

  it('genera múltiples UUIDs únicos', () => {
    const uuids = new Set();
    for (let i = 0; i < 100; i++) {
      uuids.add(generateUuid());
    }
    // Todos deberían ser únicos
    expect(uuids.size).toBe(100);
  });
});

describe('generateDeterministicUuid', () => {
  it('genera un UUID válido', () => {
    const uuid = generateDeterministicUuid('test-key');
    // Formato UUID v5: xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('genera el mismo UUID para la misma clave', () => {
    const key = 'component-key-123';
    const uuid1 = generateDeterministicUuid(key);
    const uuid2 = generateDeterministicUuid(key);
    expect(uuid1).toBe(uuid2);
  });

  it('genera UUIDs diferentes para claves diferentes', () => {
    const uuid1 = generateDeterministicUuid('key-1');
    const uuid2 = generateDeterministicUuid('key-2');
    const uuid3 = generateDeterministicUuid('key-3');
    expect(uuid1).not.toBe(uuid2);
    expect(uuid2).not.toBe(uuid3);
    expect(uuid1).not.toBe(uuid3);
  });

  it('genera UUIDs determinísticos consistentes', () => {
    const key = 'my-component-key';
    const uuids = Array.from({ length: 10 }, () => generateDeterministicUuid(key));
    // Todos deberían ser iguales
    const allSame = uuids.every(uuid => uuid === uuids[0]);
    expect(allSame).toBe(true);
  });

  it('maneja claves vacías', () => {
    const uuid = generateDeterministicUuid('');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('maneja claves con caracteres especiales', () => {
    const uuid1 = generateDeterministicUuid('key/with/slashes');
    const uuid2 = generateDeterministicUuid('key-with-dashes');
    const uuid3 = generateDeterministicUuid('key.with.dots');
    expect(uuid1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(uuid2).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(uuid3).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(uuid1).not.toBe(uuid2);
    expect(uuid2).not.toBe(uuid3);
  });

  it('diferencia entre mayúsculas y minúsculas', () => {
    const uuid1 = generateDeterministicUuid('Key');
    const uuid2 = generateDeterministicUuid('key');
    expect(uuid1).not.toBe(uuid2);
  });
});
