import {
  isAliasValue,
  translateAliasValue,
  translateGenericVariable,
  translateScope,
  translateVariableValues
} from '@plugin/translators/tokens';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

const VALID_FONT_WEIGHT_VALUES = [
  'thin',
  'thinitalic',
  'extralight',
  'extralightitalic',
  'light',
  'lightitalic',
  'regular',
  'italic',
  'medium',
  'mediumitalic',
  'semibold',
  'semibolditalic',
  'bold',
  'bolditalic',
  'extrabold',
  'extrabolditalic',
  'black',
  'blackitalic'
];

const isValidFontWeightValue = (value: string): boolean => {
  return VALID_FONT_WEIGHT_VALUES.includes(value);
};

const isStringValue = (value: VariableValue): value is string => {
  return typeof value === 'string';
};

const translateValue = (value: VariableValue, tokenType: TokenType): Token['$value'] | null => {
  if (isAliasValue(value)) {
    return translateAliasValue(value);
  }

  if (isStringValue(value)) {
    if (tokenType === 'fontFamilies') {
      return [value];
    }

    if (tokenType === 'fontWeights') {
      return isValidFontWeightValue(value) ? value : null;
    }

    return value;
  }

  return null;
};

const translateScopes = (variable: Variable): TokenType[] => {
  if (variable.scopes[0] === 'ALL_SCOPES') {
    return ['fontWeights', 'fontFamilies'];
  }

  return variable.scopes.map(scope => translateScope(scope)).filter(scope => scope !== null);
};

export const translateTextVariable = (
  variable: Variable,
  variableName: string,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  return translateGenericVariable(variable, variableName, modeId, (variable, modeId) =>
    translateVariableValues(variable, modeId, translateScopes, translateValue)
  );
};
