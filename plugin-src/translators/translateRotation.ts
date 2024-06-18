import { ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';

export const translateRotation = (
  transform: Transform,
  rotation: number
): Pick<ShapeBaseAttributes, 'transform' | 'transformInverse' | 'rotation'> => {
  return {
    rotation,
    transform: {
      a: transform[0][0],
      b: transform[1][0],
      c: transform[0][1],
      d: transform[1][1],
      e: 0,
      f: 0
    },
    transformInverse: {
      a: transform[0][0],
      b: transform[0][1],
      c: transform[1][0],
      d: transform[1][1],
      e: 0,
      f: 0
    }
  };
};

export const translateZeroRotation = (): Pick<
  ShapeBaseAttributes,
  'transform' | 'transformInverse' | 'rotation'
> => ({
  rotation: 0,
  transform: undefined,
  transformInverse: undefined
});
