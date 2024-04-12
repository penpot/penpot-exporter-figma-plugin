import { Fill } from '../../ui/lib/types/utils/fill';
// import { translateGradientLinearFill } from './translateGradientLinearFill';
import { translateSolidFill } from './translateSolidFill';

const translateFill = (
  fill: Paint,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  width: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  height: number
): Fill | undefined => {
  switch (fill.type) {
    case 'SOLID':
      return translateSolidFill(fill);
    // @TODO: fix this
    // case 'GRADIENT_LINEAR':
    //   return translateGradientLinearFill(fill, width, height);
  }

  console.error('Color type ' + fill.type + ' not supported yet');
};

export const translateFills = (
  fills: readonly Paint[] | typeof figma.mixed,
  width: number,
  height: number
): Fill[] => {
  // @TODO: think better variable name
  // @TODO: make it work with figma.mixed
  const fills2 = fills === figma.mixed ? [] : fills;

  const penpotFills = [];

  for (const fill of fills2) {
    const penpotFill = translateFill(fill, width, height);

    if (penpotFill) {
      penpotFills.unshift(penpotFill);
    }
  }

  return penpotFills;
};
