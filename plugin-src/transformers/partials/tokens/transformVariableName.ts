export const transformVariableName = (variable: Variable): string => {
  return variable.name.replace(/\//g, '.').replace(/[^a-zA-Z0-9\-$_.]/g, '');
};
