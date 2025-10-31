import { variables } from '@plugin/libraries';
import { transformScope, transformVariableName } from '@plugin/transformers/partials/tokens';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

const transformFloatValue = (value: number, tokenType: TokenType): string => {
  if (tokenType === 'opacity') {
    return (value / 100).toString();
  }

  return value.toString();
};

const transformScopes = (variable: Variable): TokenType[] => {
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

  return variable.scopes.map(scope => transformScope(scope)).filter(scope => scope !== null);
};

export const transformFloatVariable = (
  variable: Variable,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  const value = variable.valuesByMode[modeId];

  if (typeof value !== 'number') return null;

  const tokens: Record<string, Token> = {};
  const tokenTypes = transformScopes(variable);
  const variableName = transformVariableName(variable);

  if (tokenTypes.length === 1) {
    variables.set(`${variable.id}.${tokenTypes[0]}`, variableName);

    return [
      variableName,
      {
        $value: transformFloatValue(value, tokenTypes[0]),
        $type: tokenTypes[0],
        $description: variable.description
      }
    ];
  }

  for (const tokenType of tokenTypes) {
    variables.set(`${variable.id}.${tokenType}`, `${variableName}.${tokenType}`);

    tokens[tokenType] = {
      $value: transformFloatValue(value, tokenType),
      $type: tokenType,
      $description: variable.description
    };
  }

  return [variableName, tokens];
};
