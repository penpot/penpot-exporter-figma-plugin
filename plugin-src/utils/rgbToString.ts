export const rgbToString = (color: RGB | RGBA): string => {
  const r = Math.round(255 * color.r);
  const g = Math.round(255 * color.g);
  const b = Math.round(255 * color.b);

  if ('a' in color && color.a !== 1) {
    const a = color.a.toFixed(2);

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  return `rgb(${r}, ${g}, ${b})`;
};
