import { Fill } from '../utils/fill';

export type TextContent = {
  type: 'root';
  key?: string;
  children?: ParagraphSet[];
};

type ParagraphSet = {
  type: 'paragraph-set';
  key?: string;
  children: Paragraph[];
};

type Paragraph = {
  type: 'paragraph';
  key?: string;
  fills?: Fill[];
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  fontWeight?: string;
  direction?: string;
  textDecoration?: string;
  textTransform?: string;
  typographyRefId?: string;
  typographyRefFile?: string;
  children: TextNode[];
};

type TextNode = {
  text: string;
  key?: string;
  fills?: Fill[];
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  fontWeight?: string;
  direction?: string;
  textDecoration?: string;
  textTransform?: string;
  typographyRefId?: string;
  typographyRefFile?: string;
};
