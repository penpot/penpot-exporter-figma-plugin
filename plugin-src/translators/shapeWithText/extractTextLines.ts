import { stripSvgDefs } from '@plugin/translators/shapeWithText/svgAttrs';

const decodeCodePointEntity = (value: string, radix: number, fallback: string): string => {
  const codePoint = parseInt(value, radix);
  return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : fallback;
};

const NAMED_ENTITIES: Record<string, string> = {
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>'
};

const decodeXmlText = (input: string): string =>
  input
    .replace(/&(quot|apos|lt|gt);/g, (_, name: string) => NAMED_ENTITIES[name])
    .replace(/&#x([0-9a-f]+);/gi, (match, hex: string) => decodeCodePointEntity(hex, 16, match))
    .replace(/&#([0-9]+);/g, (match, decimal: string) => decodeCodePointEntity(decimal, 10, match))
    .replace(/&amp;/g, '&');

export const extractTextLines = (editableSvg: string): string[] => {
  const textMatch = stripSvgDefs(editableSvg).match(/<text\b[^>]*>([\s\S]*?)<\/text>/i);
  if (!textMatch) return [];

  const lines: string[] = [];
  const regex = /<tspan\b[^>]*>([\s\S]*?)<\/tspan>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(textMatch[1])) !== null) {
    lines.push(decodeXmlText(match[1]));
  }

  return lines;
};
