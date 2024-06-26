import { TextTypography } from '@ui/lib/types/shapes/textShape';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type Typography = TextTypography & {
  id?: Uuid;
  name?: string;
  path?: string;
};
