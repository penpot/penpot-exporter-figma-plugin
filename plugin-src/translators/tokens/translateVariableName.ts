import { variableNames } from '@plugin/libraries';
import { sanitizeUniqueName } from '@plugin/translators/tokens/sanitizeUniqueName';

export const translateVariableName = (variable: Variable): string => {
  if (variableNames.has(variable.id)) {
    return variableNames.get(variable.id)!;
  }

  const name = sanitizeUniqueName(variable.name);

  variableNames.set(variable.id, name);

  return name;
};
