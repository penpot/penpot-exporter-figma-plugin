import { describe, expect, it } from 'vitest';

import { extractShadows } from '@plugin/translators/shapeWithText/extractShadows';

const buildFilter = (id: string, body: string): string =>
  `<filter id="${id}" x="-2" y="0" width="60" height="40">${body}</filter>`;

const baseDropShadowBody = [
  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
  '<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>',
  '<feOffset dx="0" dy="4"/>',
  '<feGaussianBlur stdDeviation="2"/>',
  '<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>'
].join('');

describe('extractShadows', () => {
  it('returns an empty list when the SVG has no <filter>', () => {
    expect(extractShadows('<svg><path d="M 0 0"/></svg>')).toEqual([]);
  });

  it('extracts a drop shadow from a Figma drop-shadow filter', () => {
    const svg = `<svg><defs>${buildFilter('filter0_d_1_2', baseDropShadowBody)}</defs></svg>`;
    const shadows = extractShadows(svg);

    expect(shadows).toHaveLength(1);
    expect(shadows[0].style).toBe('drop-shadow');
    expect(shadows[0].offsetX).toBe(0);
    expect(shadows[0].offsetY).toBe(4);
    expect(shadows[0].blur).toBe(2);
    expect(shadows[0].spread).toBe(0);
    expect(shadows[0].color.color).toBe('#000000');
    expect(shadows[0].color.opacity).toBeCloseTo(0.25);
  });

  it('parses RGB components from the final colour matrix', () => {
    const colouredBody = [
      '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
      '<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>',
      '<feOffset dx="1" dy="2"/>',
      '<feGaussianBlur stdDeviation="3"/>',
      '<feColorMatrix values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>'
    ].join('');
    const svg = `<svg><defs>${buildFilter('filter0_d_1_2', colouredBody)}</defs></svg>`;
    const [shadow] = extractShadows(svg);

    expect(shadow.color.color).toBe('#ff0000');
    expect(shadow.color.opacity).toBeCloseTo(0.5);
    expect(shadow.offsetX).toBe(1);
    expect(shadow.blur).toBe(3);
  });

  it('recognises inner shadow filters by id', () => {
    const svg = `<svg><defs>${buildFilter('filter0_i_1_2', baseDropShadowBody)}</defs></svg>`;
    const [shadow] = extractShadows(svg);

    expect(shadow.style).toBe('inner-shadow');
  });

  it('skips filters whose id is neither drop nor inner shadow', () => {
    const svg = `<svg><defs>${buildFilter('filter0_blur_1_2', baseDropShadowBody)}</defs></svg>`;
    expect(extractShadows(svg)).toEqual([]);
  });

  it('extracts multiple stacked shadows in document order', () => {
    const svg = [
      '<svg><defs>',
      buildFilter('filter0_d_1_2', baseDropShadowBody),
      buildFilter('filter1_d_1_2', baseDropShadowBody),
      '</defs></svg>'
    ].join('');
    expect(extractShadows(svg)).toHaveLength(2);
  });

  it('splits a multi-chain filter (high preset) into one shadow per chain', () => {
    // Figma's "high" elevation preset stacks 3 drop shadows inside one filter.
    // Each chain begins with a SourceAlpha reset and has its own offset, blur,
    // and color matrix.
    const sourceAlpha =
      '<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>';
    const body = [
      '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
      sourceAlpha,
      '<feOffset dy="2"/>',
      '<feGaussianBlur stdDeviation="3"/>',
      '<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>',
      sourceAlpha,
      '<feOffset dy="8"/>',
      '<feGaussianBlur stdDeviation="10"/>',
      '<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>',
      sourceAlpha,
      '<feOffset dy="16"/>',
      '<feGaussianBlur stdDeviation="24"/>',
      '<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>'
    ].join('');
    const svg = `<svg><defs>${buildFilter('filter0_ddd_1_2', body)}</defs></svg>`;
    const shadows = extractShadows(svg);

    expect(shadows).toHaveLength(3);
    expect(shadows.map(s => s.offsetY)).toEqual([2, 8, 16]);
    expect(shadows.map(s => s.blur)).toEqual([3, 10, 24]);
    expect(shadows.map(s => s.color.opacity)).toEqual([0.1, 0.2, 0.3]);
    shadows.forEach(s => expect(s.style).toBe('drop-shadow'));
  });

  it('honours per-style ordering in mixed drop/inner ids (`_did_`)', () => {
    const sourceAlpha =
      '<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>';
    const chain = (dy: number, alpha: number): string =>
      [
        sourceAlpha,
        `<feOffset dy="${dy}"/>`,
        '<feGaussianBlur stdDeviation="2"/>',
        `<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${alpha} 0"/>`
      ].join('');
    const body = [
      '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
      chain(1, 0.1),
      chain(2, 0.2),
      chain(3, 0.3)
    ].join('');
    const svg = `<svg><defs>${buildFilter('filter0_did_1_2', body)}</defs></svg>`;
    const shadows = extractShadows(svg);

    expect(shadows.map(s => s.style)).toEqual(['drop-shadow', 'inner-shadow', 'drop-shadow']);
    expect(shadows.map(s => s.offsetY)).toEqual([1, 2, 3]);
  });

  it('extracts positive spread from feMorphology operator="dilate"', () => {
    const spreadBody = [
      '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
      '<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>',
      '<feMorphology radius="6" operator="dilate"/>',
      '<feOffset dx="0" dy="4"/>',
      '<feGaussianBlur stdDeviation="2"/>',
      '<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>'
    ].join('');
    const svg = `<svg><defs>${buildFilter('filter0_d_1_2', spreadBody)}</defs></svg>`;
    const [shadow] = extractShadows(svg);

    expect(shadow.spread).toBe(6);
  });

  it('reports negative spread for feMorphology operator="erode"', () => {
    const spreadBody = [
      '<feFlood flood-opacity="0" result="BackgroundImageFix"/>',
      '<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>',
      '<feMorphology radius="4" operator="erode"/>',
      '<feOffset dx="0" dy="2"/>',
      '<feGaussianBlur stdDeviation="1"/>',
      '<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>'
    ].join('');
    const svg = `<svg><defs>${buildFilter('filter0_i_1_2', spreadBody)}</defs></svg>`;
    const [shadow] = extractShadows(svg);

    expect(shadow.spread).toBe(-4);
  });
});
