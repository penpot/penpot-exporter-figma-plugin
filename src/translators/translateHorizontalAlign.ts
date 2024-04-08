export const translateHorizontalAlign = (align: string) => {
  if (align === 'RIGHT') {
    return Symbol.for('right');
  }
  if (align === 'CENTER') {
    return Symbol.for('center');
  }
  return Symbol.for('left');
};
