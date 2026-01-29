import { isAliasValue, isNumberValue } from '@common/variables';

import {
  translateAliasValue,
  translateGenericVariable,
  translateScope,
  translateVariableValues
} from '@plugin/translators/tokens';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

const isValidOpacityValue = (value: number): boolean => {
  return value >= 0 && value <= 100;
};

const isValidFontWeightValue = (value: number): boolean => {
  return [100, 200, 300, 400, 500, 600, 700, 800, 900, 950].includes(value);
};

const translateValue = (value: VariableValue, tokenType: TokenType): Token['$value'] | null => {
  if (isAliasValue(value)) {
    return translateAliasValue(value);
  }

  if (!isNumberValue(value)) {
    return null;
  }

  if (tokenType === 'fontWeights') {
    return isValidFontWeightValue(value) ? value.toString() : null;
  }

  if (tokenType === 'opacity') {
    return isValidOpacityValue(value) ? (value / 100).toString() : null;
  }

  return value.toString();
};

const translateScopes = (variable: Variable): TokenType[] => {
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
};

export const translateFloatVariable = (
  variable: Variable,
  variableName: string,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  return translateGenericVariable(variable, variableName, modeId, (variable, modeId) =>
    translateVariableValues(variable, modeId, translateScopes, translateValue)
  );
};
