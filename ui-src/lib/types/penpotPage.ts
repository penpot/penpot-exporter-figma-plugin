import { Children } from '@ui/lib/types/utils/children';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type PenpotPage = {
  id?: Uuid;
  name: string;
  background?: string;
} & Children;
