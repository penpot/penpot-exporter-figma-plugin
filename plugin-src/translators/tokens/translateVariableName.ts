import { uniqueVariableNames, variableNames } from '@plugin/libraries';

export const translateVariableName = (variable: Variable): string => {
  if (variableNames.has(variable.id)) {
    return variableNames.get(variable.id)!;
  }

  let name = variable.name.replace(/\//g, '.').replace(/[^a-zA-Z0-9\-$_.]/g, '');

  if (uniqueVariableNames.has(name)) {
    let i = 0;

    const uniqueName = name + '-' + i;
    while (uniqueVariableNames.has(uniqueName)) {
      i++;
    }

    name = uniqueName;
  }

  uniqueVariableNames.add(name);
  variableNames.set(variable.id, name);

  return name;
};
