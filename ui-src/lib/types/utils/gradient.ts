export const LINEAR_TYPE: unique symbol = Symbol.for('linear');
export const RADIAL_TYPE: unique symbol = Symbol.for('radial');

export type Gradient = {
  'type': 'linear' | 'radial' | typeof LINEAR_TYPE | typeof RADIAL_TYPE; // symbol
  'start-x': number;
  'start-y': number;
  'end-x': number;
  'end-y': number;
  'width': number;
  'stops': GradientStop[];
};

type GradientStop = {
  color: string;
  opacity?: number;
  offset: number;
};
