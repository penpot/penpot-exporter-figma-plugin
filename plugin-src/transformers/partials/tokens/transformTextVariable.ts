import { transformScope, transformVariableName } from '@plugin/transformers/partials/tokens';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

const transformTextValue = (value: string, tokenType: TokenType): string | string[] => {
  if (tokenType === 'fontFamilies') {
    // @TODO: Change to return [value]; when Penpot SDK supports array values
    return value;
  }

  return value;
};

const transformScopes = (variable: Variable): TokenType[] => {
  if (variable.scopes[0] === 'ALL_SCOPES') {
    return ['fontWeights', 'fontFamilies'];
  }

  return variable.scopes.map(scope => transformScope(scope)).filter(scope => scope !== null);
};

export const transformTextVariable = (
  variable: Variable,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  const value = variable.valuesByMode[modeId];

  if (typeof value !== 'string') return null;

  const tokens: Record<string, Token> = {};
  const tokenTypes = transformScopes(variable);
  const variableName = transformVariableName(variable);

  if (tokenTypes.length === 1) {
    return [
      variableName,
      {
        $value: transformTextValue(value, tokenTypes[0]),
        $type: tokenTypes[0],
        $description: variable.description
      }
    ];
  }

  for (const tokenType of tokenTypes) {
    tokens[tokenType] = {
      $value: transformTextValue(value, tokenType),
      $type: tokenType,
      $description: variable.description
    };
  }

  return [variableName, tokens];
};
