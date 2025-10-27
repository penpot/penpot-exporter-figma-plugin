import {
  transformColorVariable,
  transformFloatVariable,
  transformTextVariable
} from '@plugin/transformers/partials/tokens';

import type { Token } from '@ui/lib/types/shapes/tokens';

export const transformVariable = (
  variable: Variable,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  switch (variable.resolvedType) {
    case 'COLOR':
      return transformColorVariable(variable, modeId);
    case 'FLOAT':
      return transformFloatVariable(variable, modeId);
    case 'STRING':
      return transformTextVariable(variable, modeId);
    default:
      return null;
  }
};
