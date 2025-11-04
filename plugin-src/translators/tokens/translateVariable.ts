import {
  translateColorVariable,
  translateFloatVariable,
  translateTextVariable
} from '@plugin/translators/tokens';

import type { Token } from '@ui/lib/types/shapes/tokens';

export const translateVariable = async (
  variable: Variable,
  variableName: string,
  modeId: string
): Promise<[string, Token | Record<string, Token>] | null> => {
  switch (variable.resolvedType) {
    case 'COLOR':
      return await translateColorVariable(variable, variableName, modeId);
    case 'FLOAT':
      return translateFloatVariable(variable, variableName, modeId);
    case 'STRING':
      return translateTextVariable(variable, variableName, modeId);
    default:
      return null;
  }
};
