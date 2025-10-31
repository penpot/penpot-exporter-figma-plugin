import type { Theme } from '@ui/lib/types/shapes/tokens';

export const translateTheme = (
  collection: VariableCollection,
  modeName: string,
  setName: string
): Theme => {
  const name = modeName;
  const group = collection.name;

  return {
    name: name,
    group: group,
    description: '',
    isSource: false,
    selectedTokenSets: { [setName]: 'enabled' }
  };
};
