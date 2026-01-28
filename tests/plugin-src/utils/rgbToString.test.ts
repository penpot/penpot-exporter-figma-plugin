import { describe, expect, it } from 'vitest';

import { rgbToString } from '@plugin/utils/rgbToString';

describe('rgbToString', () => {
  it('convierte RGB a string sin alpha', () => {
    expect(rgbToString({ r: 0, g: 0, b: 0 })).toBe('rgb(0, 0, 0)');
  });

  it('convierte RGB blanco correctamente', () => {
    expect(rgbToString({ r: 1, g: 1, b: 1 })).toBe('rgb(255, 255, 255)');
  });

  it('convierte RGB rojo puro', () => {
    expect(rgbToString({ r: 1, g: 0, b: 0 })).toBe('rgb(255, 0, 0)');
  });

  it('convierte RGB con valores decimales', () => {
    expect(rgbToString({ r: 0.5, g: 0.5, b: 0.5 })).toBe('rgb(128, 128, 128)');
  });

  it('convierte RGBA a string con alpha cuando alpha es 1', () => {
    expect(rgbToString({ r: 1, g: 0, b: 0, a: 1 })).toBe('rgb(255, 0, 0)');
  });

  it('convierte RGBA a string con alpha cuando alpha no es 1', () => {
    expect(rgbToString({ r: 1, g: 0, b: 0, a: 0.5 })).toBe('rgba(255, 0, 0, 0.50)');
  });

  it('formatea alpha con 2 decimales', () => {
    expect(rgbToString({ r: 0, g: 0, b: 0, a: 0.123 })).toBe('rgba(0, 0, 0, 0.12)');
    expect(rgbToString({ r: 0, g: 0, b: 0, a: 0.999 })).toBe('rgba(0, 0, 0, 1.00)');
  });

  it('maneja alpha 0', () => {
    expect(rgbToString({ r: 1, g: 0, b: 0, a: 0 })).toBe('rgba(255, 0, 0, 0.00)');
  });

  it('redondea valores RGB correctamente', () => {
    expect(rgbToString({ r: 0.1, g: 0.2, b: 0.3 })).toBe('rgb(26, 51, 77)');
  });
});
