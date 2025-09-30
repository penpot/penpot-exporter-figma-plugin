export const translateStylePath = (figmaStyle: BaseStyleMixin): string => {
  const path = [];

  if (figmaStyle.remote) {
    path.push('Remote');
  }

  if (figmaStyle.name.includes('/')) {
    const pathParts = figmaStyle.name.split('/');
    pathParts.pop();

    path.push(...pathParts);
  }

  return path.join(' / ');
};
