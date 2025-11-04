import {
  translateGenericVariable,
  translateScope,
  translateVariableValues
} from '@plugin/translators/tokens';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

const isValidFontWeightValue = (value: string): boolean => {
  return [
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
  ].includes(value);
};

const isStringValue = (value: VariableValue): value is string => {
  return typeof value === 'string';
};

const translateValue = (value: VariableValue, tokenType: TokenType): string | null => {
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
};

const translateScopes = (variable: Variable): TokenType[] => {
  if (variable.scopes[0] === 'ALL_SCOPES') {
    return ['fontWeights', 'fontFamilies'];
  }

  return variable.scopes.map(scope => translateScope(scope)).filter(scope => scope !== null);
};

export const translateTextVariable = (
  variable: Variable,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  return translateGenericVariable(variable, modeId, (variable, modeId) =>
    translateVariableValues(variable, modeId, translateScopes, translateValue)
  );
};
