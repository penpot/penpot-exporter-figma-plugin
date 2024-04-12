export type Animation = {
  animationType: symbol; // 'dissolve' | 'slide' | 'push'
  duration: number;
  easing: symbol; // 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  way?: symbol; // 'in' | 'out'
  direction?: symbol; // 'right' | 'left' | 'up' | 'down'
  offsetEffect?: boolean;
};
