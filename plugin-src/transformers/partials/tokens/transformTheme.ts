import type { Theme } from '@ui/lib/types/shapes/tokens';

export const transformTheme = (
  collection: VariableCollection,
  modeName: string,
  setName: string
): Theme => {
  const hasMultipleModes = collection.modes.length > 1;

  const name = hasMultipleModes ? modeName : collection.name;
  const group = hasMultipleModes ? collection.name : '';

  return {
    'name': name,
    'group': group,
    'description': '',
    'is-source': false,
    'modified-at': new Date().toISOString(),
    'selectedTokenSets': { [setName]: 'enabled' }
  };
};
