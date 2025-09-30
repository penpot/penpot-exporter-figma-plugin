import type { TextTypography } from '@ui/lib/types/shapes/textShape';
import type { Uuid } from '@ui/lib/types/utils/uuid';

export type Typography = TextTypography & {
  id?: Uuid;
  name?: string;
  path?: string;
};
