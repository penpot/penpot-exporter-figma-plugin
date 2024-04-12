import { Shape } from '../shape';
import { Children } from '../utils/children';
import { GroupAttributes } from './groupAttributes';

export type GroupShape = Shape & GroupAttributes & Children;
