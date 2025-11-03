import {
  translateColorVariable,
  translateFloatVariable,
  translateTextVariable
} from '@plugin/translators/tokens';

import type { Token } from '@ui/lib/types/shapes/tokens';

export const translateVariable = async (
  variable: Variable,
  modeId: string
): Promise<[string, Token | Record<string, Token>] | null> => {
  switch (variable.resolvedType) {
    case 'COLOR':
      return await translateColorVariable(variable, modeId);
    case 'FLOAT':
      return translateFloatVariable(variable, modeId);
    case 'STRING':
      return translateTextVariable(variable, modeId);
    default:
      return null;
  }
};
