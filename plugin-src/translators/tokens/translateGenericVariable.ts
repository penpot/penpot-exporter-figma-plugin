import { variables } from '@plugin/libraries';
import { translateVariableName } from '@plugin/translators/tokens/translateVariableName';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

export const translateGenericVariable = (
  variable: Variable,
  modeId: string,
  translateScopes: (variable: Variable) => TokenType[],
  translateValue: (value: VariableValue, tokenType: TokenType) => string | null
): [string, Token | Record<string, Token>] | null => {
  const value = variable.valuesByMode[modeId];

  const tokenTypes = translateScopes(variable);
  const variableName = translateVariableName(variable);
  const variableTypes = new Set<TokenType>();

  const tokens: Token[] = [];

  for (const tokenType of tokenTypes) {
    const $value = translateValue(value, tokenType);
    if (!$value) continue;

    variableTypes.add(tokenType);

    tokens.push({
      $value,
      $type: tokenType,
      $description: variable.description
    });
  }

  if (tokens.length === 0) {
    return null;
  }

  if (tokens.length === 1) {
    variables.set(`${variable.id}.${tokens[0].$type}`, variableName);

    return [variableName, tokens[0]];
  }

  return [
    variableName,
    tokens.reduce(
      (acc, token) => {
        const tokenType = token.$type;
        acc[tokenType] = token;

        variables.set(`${variable.id}.${tokenType}`, `${variableName}.${tokenType}`);

        return acc;
      },
      {} as Record<string, Token>
    )
  ];
};
