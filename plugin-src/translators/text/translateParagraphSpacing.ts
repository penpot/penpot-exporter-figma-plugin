export const translateParagraphSpacing = (
  node: TextNode,
  characters: string,
  fontSize: number,
  lineHeight: number
): string => {
  const paragraphSpacing = calculateParagraphSpacing(node.paragraphSpacing, fontSize, lineHeight);
  const space = '\n'.repeat(paragraphSpacing);

  return characters.replace(/\n/g, `\n${space}`);
};

const calculateParagraphSpacing = (
  paragraphSpacing: number,
  fontSize: number,
  lineHeight: number
): number => {
  const lineSpacing = fontSize * lineHeight;

  return Math.ceil(paragraphSpacing / lineSpacing);
};
