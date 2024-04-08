import { translateGradientLinearFill, translateSolidFill } from '.';

const translateFill = (fill: Paint /*, width: number, height: number*/) => {
  if (fill.type === 'SOLID') {
    return translateSolidFill(fill);
  } else if (fill.type === 'GRADIENT_LINEAR') {
    return translateGradientLinearFill(fill /*, width, height*/);
  } else {
    console.error('Color type ' + fill.type + ' not supported yet');
    return null;
  }
};

export const translateFills = (fills: readonly Paint[] /*, width: number, height: number*/) => {
  const penpotFills = [];
  let penpotFill = null;
  for (const fill of fills) {
    penpotFill = translateFill(fill /*, width, height*/);

    if (penpotFill !== null) {
      penpotFills.unshift(penpotFill);
    }
  }
  return penpotFills;
};
