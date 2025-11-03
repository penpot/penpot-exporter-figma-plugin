import { translateVariableName } from '@plugin/translators/tokens/translateVariableName';

export const isAliasValue = (value: VariableValue): value is VariableAlias => {
  return typeof value === 'object' && 'id' in value;
};

export const translateAliasValue = async (value: VariableAlias): Promise<string | null> => {
  const variable = await figma.variables.getVariableByIdAsync(value.id);

  if (!variable) {
    return null;
  }

  return '{' + translateVariableName(variable) + '}';
};
