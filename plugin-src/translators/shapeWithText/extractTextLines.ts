import { stripSvgDefs } from '@plugin/translators/shapeWithText/parseSvg';

// Reads the text content of each <tspan> inside the editable SVG export's
// <text> element. Penpot renders text with its own font metrics, which differ
// just enough from Figma's that an exact bbox isn't sufficient to reproduce
// the same line wrapping. We use these per-line strings to inject hard `\n`
// breaks into the Penpot text content, forcing Penpot to wrap at the same
// positions Figma did.

const decodeCodePointEntity = (value: string, radix: number, fallback: string): string => {
  const codePoint = parseInt(value, radix);
  return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : fallback;
};

const decodeXmlText = (input: string): string =>
  input
    .replace(/&#x([0-9a-f]+);/gi, (match, hex: string) => decodeCodePointEntity(hex, 16, match))
    .replace(/&#([0-9]+);/g, (match, decimal: string) => decodeCodePointEntity(decimal, 10, match))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
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
