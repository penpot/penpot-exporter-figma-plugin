import { describe, expect, it } from 'vitest';

import { translateStyleName } from '@plugin/translators/styles';

const style = (name: string): BaseStyle => ({ name }) as BaseStyle;

describe('translateStyleName', () => {
  it('devuelve el nombre tal cual cuando no hay separadores', () => {
    expect(translateStyleName(style('Primary'))).toBe('Primary');
  });

  it('devuelve el último segmento de un nombre con ruta', () => {
    expect(translateStyleName(style('Brand/Primary'))).toBe('Primary');
  });

  it('ignora un segmento final vacío por barra al final', () => {
    // Penpot rechaza nombres vacíos ("expected valid color")
    expect(translateStyleName(style('Primary/'))).toBe('Primary');
  });

  it('ignora segmentos en blanco intermedios y finales', () => {
    expect(translateStyleName(style('Brand//Primary/  /'))).toBe('Primary');
  });

  it('recorta espacios alrededor del segmento', () => {
    expect(translateStyleName(style('Brand/ Primary '))).toBe('Primary');
  });

  it('usa un nombre por defecto si todos los segmentos están en blanco', () => {
    expect(translateStyleName(style('/'))).toBe('Untitled');
    expect(translateStyleName(style('   '))).toBe('Untitled');
    expect(translateStyleName(style(''))).toBe('Untitled');
  });
});
