import { variables } from '@plugin/libraries';
import { translateVariableName } from '@plugin/translators/tokens';
import { rgbToString } from '@plugin/utils/rgbToString';

import type { Token } from '@ui/lib/types/shapes/tokens';

const isColorValue = (value: VariableValue): value is RGB | RGBA => {
  return typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value;
};

export const translateColorVariable = (
  variable: Variable,
  modeId: string
): [string, Token] | null => {
  const value = variable.valuesByMode[modeId];

  if (!isColorValue(value)) return null;

  const variableName = translateVariableName(variable);

  variables.set(`${variable.id}.color`, variableName);

  return [
    variableName,
    {
      $value: rgbToString(value),
      $type: 'color',
      $description: variable.description
    }
  ];
};
