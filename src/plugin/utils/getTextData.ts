import { NodeData, TextData } from '../../common/interfaces';

export const getTextData = (baseNode: BaseNode, nodeData: NodeData): TextData | undefined => {
  if (baseNode.type === 'TEXT') {
    const styledTextSegments = baseNode.getStyledTextSegments([
      'fontName',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'letterSpacing',
      'textCase',
      'textDecoration',
      'fills'
    ]);

    if (styledTextSegments[0]) {
      return {
        ...nodeData,
        fontName: styledTextSegments[0].fontName,
        fontSize: styledTextSegments[0].fontSize.toString(),
        fontWeight: styledTextSegments[0].fontWeight.toString(),
        characters: baseNode.characters,
        lineHeight: styledTextSegments[0].lineHeight,
        letterSpacing: styledTextSegments[0].letterSpacing,
        fills: styledTextSegments[0].fills,
        textCase: styledTextSegments[0].textCase,
        textDecoration: styledTextSegments[0].textDecoration,
        textAlignHorizontal: baseNode.textAlignHorizontal,
        textAlignVertical: baseNode.textAlignVertical,
        children: styledTextSegments
      } as TextData;
    }
  }
};
