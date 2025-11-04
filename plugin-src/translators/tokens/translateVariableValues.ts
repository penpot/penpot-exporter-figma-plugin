import type { TokenType } from '@ui/lib/types/shapes/tokens';

export const translateVariableValues = (
  variable: Variable,
  modeId: string,
  translateScopes: (variable: Variable) => TokenType[],
  translateValue: (value: VariableValue, tokenType: TokenType) => string | null
): Map<TokenType, string> => {
  const value = variable.valuesByMode[modeId];

  const tokenTypes = translateScopes(variable);
  const variableTypes = new Map<TokenType, string>();

  for (const tokenType of tokenTypes) {
    const $value = translateValue(value, tokenType);
    if (!$value) continue;

    variableTypes.set(tokenType, $value);
  }

  return variableTypes;
};
