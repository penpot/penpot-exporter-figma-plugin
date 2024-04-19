import { Uuid } from '@ui/lib/types/utils/uuid';

export type GridCell = {
  id?: Uuid;
  areaName?: string;
  row: number;
  rowSpan: number;
  column: number;
  columnSpan: number;
  position?: 'auto' | 'manual' | 'area';
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  shapes?: Uuid[];
};
