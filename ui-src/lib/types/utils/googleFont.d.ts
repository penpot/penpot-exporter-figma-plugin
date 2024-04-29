export type GoogleFont = {
  family: string;
  variants?: string[];
  subsets?: string[];
  version: string;
  lastModified: string;
  files?: { [key: string]: string | undefined };
  category: string;
  kind: string;
  menu: string;
};
