export type Grid = ColumnGrid | RowGrid | SquareGrid;

export type SavedGrids = {
  square?: SquareParams;
  row?: ColumnParams;
  column?: ColumnParams;
};

type ColumnGrid = {
  type: 'column';
  display: boolean;
  params: ColumnParams;
};

type RowGrid = {
  type: 'row';
  display: boolean;
  params: ColumnParams;
};

type SquareGrid = {
  type: 'square';
  display: boolean;
  params: SquareParams;
};

type ColumnParams = {
  color: GridColor;
  type?: 'stretch' | 'left' | 'center' | 'right';
  size?: number;
  margin?: number;
  itemLength?: number;
  gutter?: number;
};

type SquareParams = {
  size: number;
  color: GridColor;
};

type GridColor = {
  color: string; // hex color
  opacity: number;
};
