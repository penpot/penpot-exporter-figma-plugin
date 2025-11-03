import { translateGenericVariable, translateScope } from '@plugin/translators/tokens';

import type { Token } from '@ui/lib/types/shapes/tokens';

const isValidFontWeightValue = (value: number): boolean => {
  return [100, 200, 300, 400, 500, 600, 700, 800, 900, 950].includes(value);
};

const isNumberValue = (value: VariableValue): value is number => {
  return typeof value === 'number';
};

export const translateFloatVariable = (
  variable: Variable,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  return translateGenericVariable(
    variable,
    modeId,
    variable => {
      if (variable.scopes.length === 0) {
        return ['number'];
      }

      if (variable.scopes[0] === 'ALL_SCOPES') {
        return [
          'borderRadius',
          'sizing',
          'spacing',
          'borderWidth',
          'opacity',
          'fontWeights',
          'fontSizes',
          'letterSpacing'
        ];
      }

      return variable.scopes.map(scope => translateScope(scope)).filter(scope => scope !== null);
    },
    (value, tokenType) => {
      if (!isNumberValue(value)) {
        return null;
      }

      if (tokenType === 'fontWeights') {
        return isValidFontWeightValue(value) ? value.toString() : null;
      }

      if (tokenType === 'opacity') {
        return (value / 100).toString();
      }

      return value.toString();
    }
  );
};
