import { Children } from '@ui/lib/types/utils/children';
import { SavedGrids } from '@ui/lib/types/utils/grid';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type PenpotPage = {
  name: string;
  options?: PenpotPageOptions;
} & Children;

export type PenpotPageOptions = {
  'background'?: string; // hex color
  'saved-grids'?: SavedGrids;
  'flows'?: Flow[];
  'guides'?: { [uuid: Uuid]: Guide };
};

type Flow = {
  'id'?: Uuid;
  'name': string;
  'starting-frame': Uuid;
};

type Guide = {
  'id'?: Uuid;
  'axis': 'x' | 'y';
  'position': number;
  'frame-id'?: Uuid;
};
