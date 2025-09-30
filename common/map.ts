export const toObject = <T>(map: Map<string, T>): Record<string, T> => {
  return Object.fromEntries(map.entries());
};

export const toArray = <T>(map: Map<string, T>): [string, T][] => {
  return Array.from(map.entries());
};

export const init = <T>(map: Map<string, T>, records: Record<string, T>): void => {
  map.clear();

  const entries = Object.entries(records);

  for (const [key, value] of entries) {
    map.set(key, value);
  }
};
