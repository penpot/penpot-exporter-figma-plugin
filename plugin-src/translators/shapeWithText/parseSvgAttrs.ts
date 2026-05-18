// Tiny SVG attribute parser shared by the geometry and text-layout extractors.
// Returns the `name="value"` pairs from inside an SVG element's opening tag.

const ATTR_REGEX = /([\w-]+)\s*=\s*"([^"]*)"/g;
const DEFS_REGEX = /<defs\b[^>]*>[\s\S]*?<\/defs>/gi;

// Drop <defs> so clipPath / mask / gradient content isn't mistaken for the
// visible geometry or text.
export const stripSvgDefs = (svg: string): string => svg.replace(DEFS_REGEX, '');

export const parseSvgAttrs = (input: string): Record<string, string> => {
  const result: Record<string, string> = {};
  ATTR_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = ATTR_REGEX.exec(input)) !== null) {
    result[match[1]] = match[2];
  }

  return result;
};

export const numAttr = (value: string | undefined, fallback = 0): number => {
  if (value === undefined) return fallback;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
