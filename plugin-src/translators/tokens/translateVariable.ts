import {
  translateColorVariable,
  translateFloatVariable,
  translateTextVariable,
  translateVariableName
} from '@plugin/translators/tokens';

import type { Token } from '@ui/lib/types/shapes/tokens';

export const translateVariable = (
  variable: Variable,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  const variableName = translateVariableName(variable);

  switch (variable.resolvedType) {
    case 'COLOR':
      return translateColorVariable(variable, variableName, modeId);
    case 'FLOAT':
      return translateFloatVariable(variable, variableName, modeId);
    case 'STRING':
      return translateTextVariable(variable, variableName, modeId);
    default:
      return null;
  }
};
