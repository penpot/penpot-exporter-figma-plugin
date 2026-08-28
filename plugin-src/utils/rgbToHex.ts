// Channel values outside [0,1] (or non-finite) would produce an invalid hex
// string that Penpot rejects at import time, so clamp defensively.
const toChannel = (value: number): number => {
  return Number.isFinite(value) ? Math.round(255 * Math.min(1, Math.max(0, value))) : 0;
};

export const rgbToHex = (color: RGB | RGBA): string => {
  const r = toChannel(color.r);
  const g = toChannel(color.g);
  const b = toChannel(color.b);
  const rgb = (r << 16) | (g << 8) | (b << 0);
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
};
