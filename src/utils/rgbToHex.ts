export const rgbToHex = (color: RGB) => {
  const r = Math.round(255 * color.r);
  const g = Math.round(255 * color.g);
  const b = Math.round(255 * color.b);
  const rgb = (r << 16) | (g << 8) | (b << 0);
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
};
