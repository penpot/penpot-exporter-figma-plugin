export const translateStyleName = (figmaStyle: BaseStyle): string => {
  const splitName = figmaStyle.name.split('/');

  if (splitName.length > 0) {
    return splitName.pop() as string;
  }

  return figmaStyle.name;
};
