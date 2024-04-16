import { BlendMode as PenpotBlendMode } from '@ui/lib/types/utils/blendModes';

export const translateBlendMode = (blendMode: BlendMode): PenpotBlendMode => {
  switch (blendMode) {
    //@TODO: is not translatable in penpot, this is the closest one
    case 'PASS_THROUGH':
    case 'NORMAL':
      return 'normal';
    //@TODO: is not translatable in penpot, this is the closest one
    case 'LINEAR_BURN':
    case 'DARKEN':
      return 'darken';
    case 'MULTIPLY':
      return 'multiply';
    case 'COLOR_BURN':
      return 'color-burn';
    case 'LIGHTEN':
      return 'lighten';
    case 'SCREEN':
      return 'screen';
    //@TODO: is not translatable in penpot, this is the closest one
    case 'LINEAR_DODGE':
    case 'COLOR_DODGE':
      return 'color-dodge';
    case 'OVERLAY':
      return 'overlay';
    case 'SOFT_LIGHT':
      return 'soft-light';
    case 'HARD_LIGHT':
      return 'hard-light';
    case 'DIFFERENCE':
      return 'difference';
    case 'EXCLUSION':
      return 'exclusion';
    case 'HUE':
      return 'hue';
    case 'SATURATION':
      return 'saturation';
    case 'COLOR':
      return 'color';
    case 'LUMINOSITY':
      return 'luminosity';
    default:
      return 'normal';
  }
};
