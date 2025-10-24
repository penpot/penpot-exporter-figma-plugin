import type { Theme } from '@ui/lib/types/shapes/tokens';

export const transformTheme = (
  collection: VariableCollection,
  modeName: string,
  setName: string
): Theme => {
  return {
    'name': modeName,
    'group': collection.name,
    'description': '',
    'is-source': false,
    'modified-at': new Date().toISOString(),
    'selectedTokenSets': { [setName]: 'enabled' }
  };
};
