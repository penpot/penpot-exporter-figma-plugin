import { isAliasValue, isColorValue } from '@common/variables';

import { variables } from '@plugin/libraries';
import { translateAliasValue } from '@plugin/translators/tokens/translateAliasValue';
import { rgbToString } from '@plugin/utils/rgbToString';

import type { Token } from '@ui/lib/types/shapes/tokens';

const translateColorValue = (value: VariableValue): Token['$value'] | null => {
  if (isAliasValue(value)) {
    return translateAliasValue(value);
  }

  if (!isColorValue(value)) {
    return null;
  }

  return rgbToString(value);
};

export const translateColorVariable = (
  variable: Variable,
  variableName: string,
  modeId: string
): [string, Token | Record<string, Token>] | null => {
  const value = variable.valuesByMode[modeId];

  const $value = translateColorValue(value);
  if (!$value) return null;

  variables.set(`${variable.id}.color`, variableName);

  return [
    variableName,
    {
      $value,
      $type: 'color',
      $description: variable.description
    }
  ];
};
