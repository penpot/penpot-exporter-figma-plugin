/**
 * Type guards and utility functions for Figma Variable values
 */

export const isAliasValue = (value: VariableValue): value is VariableAlias => {
  return typeof value === 'object' && 'id' in value;
};

export const isColorValue = (value: VariableValue): value is RGB | RGBA => {
  return typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value;
};

export const isNumberValue = (value: VariableValue): value is number => {
  return typeof value === 'number';
};

export const isStringValue = (value: VariableValue): value is string => {
  return typeof value === 'string';
};
