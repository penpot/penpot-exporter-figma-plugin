export const stripSvgDefs = (svg: string): string =>
  svg.replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/gi, '');

export const parseSvgAttrs = (input: string): Record<string, string> => {
  const regex = /([\w-]+)\s*=\s*"([^"]*)"/g;
  const result: Record<string, string> = {};

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    result[match[1]] = match[2];
  }

  return result;
};

export const numAttr = (value: string | undefined, fallback = 0): number => {
  if (value === undefined) return fallback;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
