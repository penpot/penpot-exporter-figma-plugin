export const translateParagraphIndent = (
  node: TextNode,
  characters: string,
  fontSize: number,
  letterSpacing: number,
  index: number
): string => {
  const indentSpaces = calculateIndentSpaces(node.paragraphIndent, fontSize, letterSpacing);
  const space = ' '.repeat(indentSpaces);

  if (index === 0) return `${space}${characters.replace(/\n/g, `\n${space}`)}`;
  return characters.replace(/\n/g, `\n${space}`);
};

const calculateIndentSpaces = (
  indentWidth: number,
  fontSize: number,
  letterSpacing: number
): number => {
  // Character constant typically run somewhere between 1.6 and 3.25, with a mean value of roughly 2.25
  // https://grtcalculator.com/math/
  const spaceWidth = fontSize / 2.25 + letterSpacing;
  return Math.ceil(indentWidth / spaceWidth);
};
