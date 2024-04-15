import { BlendMode as PenpotBlendMode } from '@ui/lib/types/utils/blendModes';

export const translateBlendMode = (blendMode: BlendMode): PenpotBlendMode => {
  switch (blendMode) {
    case 'PASS_THROUGH':
      return 'normal'; //@TODO: is not translatable in penpot, this is the closest one
    case 'NORMAL':
      return 'normal';
    case 'DARKEN':
      return 'darken';
    case 'MULTIPLY':
      return 'multiply';
    case 'LINEAR_BURN':
      return 'darken'; //@TODO: is not translatable in penpot, this is the closest one
    case 'COLOR_BURN':
      return 'color-burn';
    case 'LIGHTEN':
      return 'lighten';
    case 'LINEAR_DODGE':
      return 'color-dodge'; //@TODO: is not translatable in penpot, this is the closest one
    case 'SCREEN':
      return 'screen';
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
