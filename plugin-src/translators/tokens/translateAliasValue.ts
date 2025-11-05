export const isAliasValue = (value: VariableValue): value is VariableAlias => {
  return typeof value === 'object' && 'id' in value;
};

export const translateAliasValue = (value: VariableAlias): string => {
  return '{' + value.id + '}';
};
