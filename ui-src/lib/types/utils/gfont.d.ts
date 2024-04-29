export type Gfont = {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: {
    regular?: string;
    italic?: string;
  };
  category: string;
  kind: string;
  menu: string;
};
