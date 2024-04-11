import { AnimationType } from './animationType';
import { DirectionType } from './directionType';
import { EasingType } from './easingType';
import { WayType } from './wayType';

export type Animation = {
  animationType: AnimationType;
  duration: number;
  easing: EasingType;
  way?: WayType;
  direction?: DirectionType;
  offsetEffect?: boolean;
};
