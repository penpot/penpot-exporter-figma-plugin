import { Shape } from '@ui/lib/types/shape';
import { Children } from '@ui/lib/types/utils/children';

import { GroupAttributes } from './groupAttributes';

export type GroupShape = Shape & GroupAttributes & Children;
