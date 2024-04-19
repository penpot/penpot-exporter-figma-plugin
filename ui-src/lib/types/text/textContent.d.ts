import { Fill } from '@ui/lib/types/utils/fill';

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
  children: TextNode[];
} & TextStyle;

type TextNode = {
  text: string;
  key?: string;
} & TextStyle;

type TextStyle = {
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  fontWeight?: string;
  textDecoration?: string;
  textTransform?: string;
  direction?: string;
  typographyRefId?: string;
  typographyRefFile?: string;
  fills?: Fill[];
};
