import { Children } from '@ui/lib/types/utils/children';
import { SavedGrids } from '@ui/lib/types/utils/grid';
import { Uuid } from '@ui/lib/types/utils/uuid';

export type PenpotPage = {
  name: string;
  options?: PenpotPageOptions;
} & Children;

export type PenpotPageOptions = {
  background?: string; // hex color
  savedGrids?: SavedGrids;
  flows?: Flow[];
  guides?: { [uuid: Uuid]: Guide };
};

type Flow = {
  id?: Uuid;
  name: string;
  startingFrame: Uuid;
};

type Guide = {
  id?: Uuid;
  axis: 'x' | 'y';
  position: number;
  frameId?: Uuid;
};
