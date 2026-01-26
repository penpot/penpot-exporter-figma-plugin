import type { Uuid } from '@ui/lib/types/utils/uuid';

export type PenpotFile = {
  id?: Uuid;
  name: string;
  isShared?: boolean;
  width?: number;
  height?: number;
};
