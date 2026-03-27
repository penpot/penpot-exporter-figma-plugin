import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

export const translateVariableValues = (
  variable: Variable,
  modeId: string,
  translateScopes: (variable: Variable) => TokenType[],
  translateValue: (value: VariableValue, tokenType: TokenType) => Token['$value'] | null
): Map<TokenType, Token['$value']> => {
  const value = variable.valuesByMode[modeId];

  const tokenTypes = translateScopes(variable);
  const variableTypes = new Map<TokenType, Token['$value']>();

  for (const tokenType of tokenTypes) {
    const $value = translateValue(value, tokenType);
    if (!$value) continue;

    variableTypes.set(tokenType, $value);
  }

  return variableTypes;
};
