import {
  translateColorVariable,
  translateFloatVariable,
  translateTextVariable
} from '@plugin/translators/tokens';

import type { Token } from '@ui/lib/types/shapes/tokens';

export const translateVariable = (
  variable: Variable,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  switch (variable.resolvedType) {
    case 'COLOR':
      return translateColorVariable(variable, modeId);
    case 'FLOAT':
      return translateFloatVariable(variable, modeId);
    case 'STRING':
      return translateTextVariable(variable, modeId);
    default:
      return null;
  }
};
