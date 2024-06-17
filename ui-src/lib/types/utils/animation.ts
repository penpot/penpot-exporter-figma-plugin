export type Animation = AnimationDissolve | AnimationSlide | AnimationPush;

type AnimationDissolve = {
  'animation-type': 'dissolve';
  'duration': number;
  'easing': 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
};

type AnimationSlide = {
  'animation-type': 'slide';
  'duration': number;
  'easing': 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  'way': 'in' | 'out';
  'direction': 'right' | 'left' | 'up' | 'down';
  'offset-effect': boolean;
};

type AnimationPush = {
  'animation-type': 'push';
  'duration': number;
  'easing': 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  'direction': 'right' | 'left' | 'up' | 'down';
};
