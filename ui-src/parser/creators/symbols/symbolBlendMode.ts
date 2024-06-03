import {
  BLEND_MODE_COLOR,
  BLEND_MODE_COLOR_BURN,
  BLEND_MODE_COLOR_DODGE,
  BLEND_MODE_DARKEN,
  BLEND_MODE_DIFFERENCE,
  BLEND_MODE_EXCLUSION,
  BLEND_MODE_HARD_LIGHT,
  BLEND_MODE_HUE,
  BLEND_MODE_LIGHTEN,
  BLEND_MODE_LUMINOSITY,
  BLEND_MODE_MULTIPLY,
  BLEND_MODE_NORMAL,
  BLEND_MODE_OVERLAY,
  BLEND_MODE_SATURATION,
  BLEND_MODE_SCREEN,
  BLEND_MODE_SOFT_LIGHT,
  BlendMode
} from '@ui/lib/types/utils/blendModes';

export const symbolBlendMode = (blendMode?: BlendMode): BlendMode | undefined => {
  if (!blendMode) return;

  if (typeof blendMode !== 'string') return blendMode;

  switch (blendMode) {
    case 'normal':
      return BLEND_MODE_NORMAL;
    case 'darken':
      return BLEND_MODE_DARKEN;
    case 'multiply':
      return BLEND_MODE_MULTIPLY;
    case 'color-burn':
      return BLEND_MODE_COLOR_BURN;
    case 'lighten':
      return BLEND_MODE_LIGHTEN;
    case 'screen':
      return BLEND_MODE_SCREEN;
    case 'color-dodge':
      return BLEND_MODE_COLOR_DODGE;
    case 'overlay':
      return BLEND_MODE_OVERLAY;
    case 'soft-light':
      return BLEND_MODE_SOFT_LIGHT;
    case 'hard-light':
      return BLEND_MODE_HARD_LIGHT;
    case 'difference':
      return BLEND_MODE_DIFFERENCE;
    case 'exclusion':
      return BLEND_MODE_EXCLUSION;
    case 'hue':
      return BLEND_MODE_HUE;
    case 'saturation':
      return BLEND_MODE_SATURATION;
    case 'color':
      return BLEND_MODE_COLOR;
    case 'luminosity':
      return BLEND_MODE_LUMINOSITY;
  }
};
