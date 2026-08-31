import { describe, expect, it } from 'vitest';

import { translateGradientRadialFill } from '@plugin/translators/fills/gradients/translateGradientRadialFill';

const identity: Transform = [
  [1, 0, 0],
  [0, 1, 0]
];

describe('translateGradientRadialFill', () => {
  it('keeps offsets unchanged for positions already within [0, 1]', () => {
    const fill = {
      type: 'GRADIENT_RADIAL',
      gradientTransform: identity,
      gradientStops: [
        { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
        { position: 0.5, color: { r: 0, g: 1, b: 0, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } }
      ]
    } as GradientPaint;

    const result = translateGradientRadialFill(fill);

    expect(result.fillColorGradient?.stops.map(stop => stop.offset)).toEqual([0, 0.5, 1]);
  });

  it('clamps positions above 1 to 1 (issue #412: Code-to-Canvas out-of-range positions)', () => {
    const fill = {
      type: 'GRADIENT_RADIAL',
      gradientTransform: identity,
      gradientStops: [
        { position: 100, color: { r: 1, g: 0, b: 0, a: 1 } },
        { position: 1.05, color: { r: 0, g: 1, b: 0, a: 1 } }
      ]
    } as GradientPaint;

    const result = translateGradientRadialFill(fill);

    expect(result.fillColorGradient?.stops.map(stop => stop.offset)).toEqual([1, 1]);
  });

  it('clamps negative positions to 0', () => {
    const fill = {
      type: 'GRADIENT_RADIAL',
      gradientTransform: identity,
      gradientStops: [{ position: -0.5, color: { r: 1, g: 0, b: 0, a: 1 } }]
    } as GradientPaint;

    const result = translateGradientRadialFill(fill);

    expect(result.fillColorGradient?.stops.map(stop => stop.offset)).toEqual([0]);
  });

  it('preserves color and opacity while clamping the offset', () => {
    const fill = {
      type: 'GRADIENT_RADIAL',
      gradientTransform: identity,
      opacity: 0.5,
      gradientStops: [{ position: 100, color: { r: 1, g: 0, b: 0, a: 0.8 } }]
    } as GradientPaint;

    const result = translateGradientRadialFill(fill);
    const [stop] = result.fillColorGradient?.stops ?? [];

    expect(stop.offset).toBe(1);
    expect(stop.color).toBe('#ff0000');
    expect(stop.opacity).toBeCloseTo(0.4, 5);
  });
});
