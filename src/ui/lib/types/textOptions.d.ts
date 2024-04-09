import { BaseOptions } from './baseOptions';

export type TextOptions = BaseOptions & {
  name: string;
  rotation: number;
  type: symbol;
  content: {
    type: 'root';
    key?: string;
    children?: {
      type: 'paragraph-set';
      key?: string;
      children: {
        type: 'paragraph';
        key?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fills?: any;
        fontFamily?: string;
        fontSize?: string;
        fontStyle?: string;
        fontWeight?: string;
        direction?: string;
        textDecoration?: string;
        textTransform?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typographyRefId?: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typographyRefFile?: any;
        children: {
          text: string;
          key?: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fills?: any;
          fontFamily?: string;
          fontSize?: string;
          fontStyle?: string;
          fontWeight?: string;
          direction?: string;
          textDecoration?: string;
          textTransform?: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typographyRefId?: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typographyRefFile?: any;
        }[];
      }[];
    }[];
  };
};
