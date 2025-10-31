import { variables } from '@plugin/libraries';
import { translateScope, translateVariableName } from '@plugin/translators/tokens';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

const translateFloatValue = (value: number, tokenType: TokenType): string => {
  if (tokenType === 'opacity') {
    return (value / 100).toString();
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
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  const value = variable.valuesByMode[modeId];

  if (typeof value !== 'number') return null;

  const tokens: Record<string, Token> = {};
  const tokenTypes = translateScopes(variable);
  const variableName = translateVariableName(variable);

  if (tokenTypes.length === 1) {
    variables.set(`${variable.id}.${tokenTypes[0]}`, variableName);

    return [
      variableName,
      {
        $value: translateFloatValue(value, tokenTypes[0]),
        $type: tokenTypes[0],
        $description: variable.description
      }
    ];
  }

  for (const tokenType of tokenTypes) {
    variables.set(`${variable.id}.${tokenType}`, `${variableName}.${tokenType}`);

    tokens[tokenType] = {
      $value: translateFloatValue(value, tokenType),
      $type: tokenType,
      $description: variable.description
    };
  }

  return [variableName, tokens];
};
