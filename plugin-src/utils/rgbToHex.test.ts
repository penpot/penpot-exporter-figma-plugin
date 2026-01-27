import { describe, expect, it } from 'vitest';

import { rgbToHex } from './rgbToHex';

describe('rgbToHex', () => {
  it('convierte negro correctamente', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
  });

  it('convierte blanco correctamente', () => {
    expect(rgbToHex({ r: 1, g: 1, b: 1 })).toBe('#ffffff');
  });

  it('convierte rojo puro', () => {
    expect(rgbToHex({ r: 1, g: 0, b: 0 })).toBe('#ff0000');
  });

  it('convierte verde puro', () => {
    expect(rgbToHex({ r: 0, g: 1, b: 0 })).toBe('#00ff00');
  });

  it('convierte azul puro', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 1 })).toBe('#0000ff');
  });

  it('maneja valores decimales', () => {
    expect(rgbToHex({ r: 0.5, g: 0.5, b: 0.5 })).toBe('#808080');
  });

  it('maneja valores intermedios', () => {
    expect(rgbToHex({ r: 0.2, g: 0.4, b: 0.8 })).toBe('#3366cc');
  });

  it('funciona con RGBA ignorando alpha', () => {
    expect(rgbToHex({ r: 1, g: 0, b: 0, a: 0.5 })).toBe('#ff0000');
  });
});
