import { translateGenericVariable, translateScope } from '@plugin/translators/tokens';

import type { Token } from '@ui/lib/types/shapes/tokens';

const isValidFontWeightValue = (value: string): boolean => {
  return [
    'thin',
    'extralight',
    'light',
    'regular',
    'medium',
    'semibold',
    'bold',
    'extrabold',
    'black'
  ].includes(value);
};

const isStringValue = (value: VariableValue): value is string => {
  return typeof value === 'string';
};

export const translateTextVariable = (
  variable: Variable,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  return translateGenericVariable(
    variable,
    modeId,
    variable => {
      if (variable.scopes[0] === 'ALL_SCOPES') {
        return ['fontWeights', 'fontFamilies'];
      }

      return variable.scopes.map(scope => translateScope(scope)).filter(scope => scope !== null);
    },
    (value, tokenType) => {
      if (isStringValue(value)) {
        if (tokenType === 'fontFamilies') {
          // @TODO: Change to return [value]; when Penpot SDK supports array values
          return value;
        }

        if (tokenType === 'fontWeights') {
          return isValidFontWeightValue(value) ? value.toString() : null;
        }

        return value;
      }

      return null;
    }
  );
};
