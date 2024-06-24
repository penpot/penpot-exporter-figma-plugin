import { FontId, TextTypography } from '@ui/lib/types/shapes/textShape';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type Typography = TextTypography &
  FontId & {
    id?: Uuid;
    name?: string;
    path?: string;
  };
