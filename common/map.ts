export const toObject = <T>(map: Map<string, T>): Record<string, T> => {
  const result: Record<string, T> = {};

  for (const [key, value] of map) {
    result[key] = value;
  }

  return result;
};

export const init = <T>(map: Map<string, T>, records: Record<string, T>): void => {
  map.clear();

  const entries = Object.entries(records);

  for (const [key, value] of entries) {
    map.set(key, value);
  }
};
