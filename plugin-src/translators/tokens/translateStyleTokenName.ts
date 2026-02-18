import { uniqueVariableNames } from '@plugin/libraries';

export const translateStyleTokenName = (name: string): string => {
  let sanitized = name
    .replace(/\//g, '.')
    .replace(/[^a-zA-Z0-9\-$_.]/g, '')
    .replace(/^\$/, 'S')
    .replace(/^\./, 'D')
    .replace(/\.$/, 'D')
    .replace(/\.{2,}/g, '.');

  if (sanitized === '') {
    sanitized = 'unnamed';
  }

  if (uniqueVariableNames.has(sanitized)) {
    let i = 1;

    while (uniqueVariableNames.has(`${sanitized}-${i}`)) {
      i++;
    }

    sanitized = `${sanitized}-${i}`;
  }

  uniqueVariableNames.add(sanitized);

  return sanitized;
};
