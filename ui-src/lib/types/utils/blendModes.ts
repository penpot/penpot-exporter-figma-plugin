export const BLEND_MODE_NORMAL: unique symbol = Symbol.for('normal');
export const BLEND_MODE_DARKEN: unique symbol = Symbol.for('darken');
export const BLEND_MODE_MULTIPLY: unique symbol = Symbol.for('multiply');
export const BLEND_MODE_COLOR_BURN: unique symbol = Symbol.for('color-burn');
export const BLEND_MODE_LIGHTEN: unique symbol = Symbol.for('lighten');
export const BLEND_MODE_SCREEN: unique symbol = Symbol.for('screen');
export const BLEND_MODE_COLOR_DODGE: unique symbol = Symbol.for('color-dodge');
export const BLEND_MODE_OVERLAY: unique symbol = Symbol.for('overlay');
export const BLEND_MODE_SOFT_LIGHT: unique symbol = Symbol.for('soft-light');
export const BLEND_MODE_HARD_LIGHT: unique symbol = Symbol.for('hard-light');
export const BLEND_MODE_DIFFERENCE: unique symbol = Symbol.for('difference');
export const BLEND_MODE_EXCLUSION: unique symbol = Symbol.for('exclusion');
export const BLEND_MODE_HUE: unique symbol = Symbol.for('hue');
export const BLEND_MODE_SATURATION: unique symbol = Symbol.for('saturation');
export const BLEND_MODE_COLOR: unique symbol = Symbol.for('color');
export const BLEND_MODE_LUMINOSITY: unique symbol = Symbol.for('luminosity');

export type BlendMode =
  | 'normal'
  | 'darken'
  | 'multiply'
  | 'color-burn'
  | 'lighten'
  | 'screen'
  | 'color-dodge'
  | 'overlay'
  | 'soft-light'
  | 'hard-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'
  | typeof BLEND_MODE_NORMAL
  | typeof BLEND_MODE_DARKEN
  | typeof BLEND_MODE_MULTIPLY
  | typeof BLEND_MODE_COLOR_BURN
  | typeof BLEND_MODE_LIGHTEN
  | typeof BLEND_MODE_SCREEN
  | typeof BLEND_MODE_COLOR_DODGE
  | typeof BLEND_MODE_OVERLAY
  | typeof BLEND_MODE_SOFT_LIGHT
  | typeof BLEND_MODE_HARD_LIGHT
  | typeof BLEND_MODE_DIFFERENCE
  | typeof BLEND_MODE_EXCLUSION
  | typeof BLEND_MODE_HUE
  | typeof BLEND_MODE_SATURATION
  | typeof BLEND_MODE_COLOR
  | typeof BLEND_MODE_LUMINOSITY;
