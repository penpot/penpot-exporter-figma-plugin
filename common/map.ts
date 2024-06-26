export const toObject = <T>(map: Map<string, T>): Record<string, T> => {
  return Object.fromEntries(map.entries());
};

export const toArray = <T>(map: Map<string, T>): [string, T][] => {
  return Array.from(map.entries());
};
