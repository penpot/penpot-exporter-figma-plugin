export type NodeData = {
  id: string;
  name: string;
  type: string;
  children: NodeData[];
  x: number;
  y: number;
  width: number;
  height: number;
  fills: readonly Paint[];
};

export type TextDataChildren = Pick<
  StyledTextSegment,
  | 'fills'
  | 'characters'
  | 'start'
  | 'end'
  | 'fontSize'
  | 'fontName'
  | 'fontWeight'
  | 'textDecoration'
  | 'textCase'
  | 'lineHeight'
  | 'letterSpacing'
>;

export type TextData = Pick<
  NodeData,
  'id' | 'name' | 'type' | 'x' | 'y' | 'width' | 'height' | 'fills'
> & {
  fontName: FontName;
  fontSize: string;
  fontWeight: string;
  characters: string;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  textCase: TextCase;
  textDecoration: TextDecoration;
  textAlignHorizontal: 'CENTER' | 'LEFT' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical: 'CENTER' | 'TOP' | 'BOTTOM';
  children: TextDataChildren[];
};
