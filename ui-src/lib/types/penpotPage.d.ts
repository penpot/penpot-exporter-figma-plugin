import { PenpotNode } from './penpotNode';

export type PenpotPage = {
  name: string;
  children?: PenpotNode[];
};
