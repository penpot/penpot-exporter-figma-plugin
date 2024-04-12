import { PenpotPage } from './penpotPage';

export type PenpotDocument = {
  name: string;
  children?: PenpotPage[];
};
