import { uniqueVariableNames, variableNames } from '@plugin/libraries';

export const translateVariableName = (variable: Variable): string => {
  if (variableNames.has(variable.id)) {
    return variableNames.get(variable.id)!;
  }

  let name = variable.name
    .replace(/\//g, '.')
    .replace(/[^a-zA-Z0-9\-$_.]/g, '')
    .replace(/^\$/, 'S')
    .replace(/^\./, 'D')
    .replace(/\.$/, 'D')
    .replace(/\.{2,}/g, '.');

  if (uniqueVariableNames.has(name)) {
    let i = 1;

    while (uniqueVariableNames.has(`${name}-${i}`)) {
      i++;
    }

    name = `${name}-${i}`;
  }

  uniqueVariableNames.add(name);
  variableNames.set(variable.id, name);

  return name;
};
