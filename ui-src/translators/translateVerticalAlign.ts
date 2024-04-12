export const translateVerticalAlign = (align: string) => {
  if (align === 'BOTTOM') {
    return Symbol.for('bottom');
  }
  if (align === 'CENTER') {
    return Symbol.for('center');
  }
  return Symbol.for('top');
};
