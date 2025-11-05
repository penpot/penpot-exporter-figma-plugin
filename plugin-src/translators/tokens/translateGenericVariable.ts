import { variables } from '@plugin/libraries';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

export const translateGenericVariable = (
  variable: Variable,
  variableName: string,
  modeId: string,
  translateVariableValues: (variable: Variable, modeId: string) => Map<TokenType, string>
): [string, Token | Record<string, Token>] | null => {
  const variableValues = translateVariableValues(variable, modeId);

  if (variableValues.size === 0) {
    return null;
  }

  const variableValuesIterator = variableValues.entries();

  if (variableValues.size === 1) {
    const [$type, $value] = variableValuesIterator.next().value as [TokenType, string];

    variables.set(variable.id, variableName);
    variables.set(`${variable.id}.${$type}`, variableName);

    return [variableName, { $value, $type, $description: variable.description }];
  }

  const tokens: Record<string, Token> = {};

  for (const [$type, $value] of variableValuesIterator) {
    tokens[$type] = { $value, $type, $description: variable.description };

    variables.set(variable.id, `${variableName}.${$type}`);
    variables.set(`${variable.id}.${$type}`, `${variableName}.${$type}`);
  }

  return [variableName, tokens];
};
