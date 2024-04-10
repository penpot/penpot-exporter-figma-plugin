export type Grid = ColumnGrid | RowGrid | SquareGrid;

type ColumnGrid = {
  type: 'column';
  display: boolean;
  params: ColumnParams;
};

type RowGrid = {
  type: 'column';
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
  // @TODO: Maybe we need a proper type here
  color: number;
  opacity: number;
};
