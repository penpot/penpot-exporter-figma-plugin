import { styleTokenNames } from '@plugin/libraries';
import { translateEffectStyleToken } from '@plugin/translators/tokens';

import type { Set } from '@ui/lib/types/shapes/tokens';

export const processStyleTokens = async (): Promise<[string, Set] | null> => {
  const effectStyles = await figma.getLocalEffectStylesAsync();

  const set: Set = {};

  for (const style of effectStyles) {
    const entry = translateEffectStyleToken(style);
    if (!entry) continue;

    const [name, token] = entry;
    set[name] = token;
    styleTokenNames.set(style.id, name);
  }

  if (Object.keys(set).length === 0) {
    return null;
  }

  return ['Figma Styles', set];
};
