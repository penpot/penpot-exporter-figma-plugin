import { styleTokenNames } from '@plugin/libraries';
import { translateEffectStyleToken } from '@plugin/translators/tokens';

import type { Set } from '@ui/lib/types/shapes/tokens';

export const processStyleTokens = async (): Promise<[string, Set] | null> => {
  const effectStyles = await figma.getLocalEffectStylesAsync();

  const set: Set = {};

  for (const style of effectStyles) {
    const entries = translateEffectStyleToken(style);

    for (const [name, token] of entries) {
      set[name] = token;
    }

    if (entries.length > 0) {
      if (entries.length > 1) {
        console.warn(
          `Effect style "${style.name}" has ${entries.length} shadows; only the first will be used as an applied token.`
        );
      }
      styleTokenNames.set(style.id, entries[0][0]);
    }
  }

  if (Object.keys(set).length === 0) {
    return null;
  }

  return ['Figma Styles', set];
};
