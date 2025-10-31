import { variables } from '@plugin/libraries';
import { translateScope, translateVariableName } from '@plugin/translators/tokens';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

const translateTextValue = (value: string, tokenType: TokenType): string | string[] => {
  if (tokenType === 'fontFamilies') {
    // @TODO: Change to return [value]; when Penpot SDK supports array values
    return value;
  }

  return value;
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
  const value = variable.valuesByMode[modeId];

  if (typeof value !== 'string') return null;

  const tokens: Record<string, Token> = {};
  const tokenTypes = translateScopes(variable);
  const variableName = translateVariableName(variable);

  if (tokenTypes.length === 1) {
    variables.set(`${variable.id}.${tokenTypes[0]}`, variableName);

    return [
      variableName,
      {
        $value: translateTextValue(value, tokenTypes[0]),
        $type: tokenTypes[0],
        $description: variable.description
      }
    ];
  }

  for (const tokenType of tokenTypes) {
    variables.set(`${variable.id}.${tokenType}`, `${variableName}.${tokenType}`);

    tokens[tokenType] = {
      $value: translateTextValue(value, tokenType),
      $type: tokenType,
      $description: variable.description
    };
  }

  return [variableName, tokens];
};
