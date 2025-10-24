import { transformScope, transformVariableName } from '@plugin/transformers/partials/tokens';

import type { Token, TokenType } from '@ui/lib/types/shapes/tokens';

const getFloatScopes = (variable: Variable): VariableScope[] => {
  if (variable.scopes[0] === 'ALL_SCOPES') {
    return [
      'CORNER_RADIUS',
      'WIDTH_HEIGHT',
      'GAP',
      'TEXT_CONTENT',
      'STROKE_FLOAT',
      'OPACITY',
      'EFFECT_FLOAT',
      'FONT_WEIGHT',
      'FONT_SIZE',
      'LINE_HEIGHT',
      'LETTER_SPACING',
      'PARAGRAPH_SPACING',
      'PARAGRAPH_INDENT'
    ];
  }

  return variable.scopes;
};

const transformFloatValue = (value: number, tokenType: TokenType): number => {
  if (tokenType === 'opacity') {
    return value / 100;
  }

  return value;
};

export const transformFloatVariable = (
  variable: Variable,
  modeId: string
): Record<string, Token> | null => {
  const value = variable.valuesByMode[modeId];

  if (typeof value !== 'number') return null;

  const tokens: Record<string, Token> = {};

  const scopes = getFloatScopes(variable);
  const hasMoreThanOneScope = scopes.length > 1;

  for (const scope of scopes) {
    const tokenType = transformScope(scope);
    if (!tokenType) continue;

    tokens[transformVariableName(variable, hasMoreThanOneScope ? tokenType : null)] = {
      $value: transformFloatValue(value, tokenType),
      $type: tokenType,
      $description: variable.description
    };
  }

  return tokens;
};
