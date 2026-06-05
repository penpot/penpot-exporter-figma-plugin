import type {
  GridLayoutGrid,
  LayoutGrid,
  RowsColsLayoutGrid
} from '@figma/plugin-typings/plugin-api-standalone';

import { finiteOrUndefined, rgbToHex } from '@plugin/utils';

import type {
  ColumnGrid,
  Grid,
  GridAlignment,
  RowGrid,
  SquareGrid
} from '@ui/lib/types/utils/grid';

export const translateGrids = (layoutGrids: readonly LayoutGrid[]): Grid[] => {
  return layoutGrids
    .map(grid => {
      switch (grid.pattern) {
        // `size` is required for a square grid, so it may be dropped (undefined).
        case 'GRID':
          return translateSquareGrid(grid);
        case 'ROWS':
        case 'COLUMNS':
          return translateRowColsGrid(grid);
      }
    })
    .filter((grid): grid is Grid => grid !== undefined);
};

const translateSquareGrid = (layoutGrid: GridLayoutGrid): SquareGrid | undefined => {
  const size = finiteOrUndefined(layoutGrid.sectionSize);

  if (size === undefined) return;

  return {
    type: 'square',
    display: layoutGrid.visible ? layoutGrid.visible : false,
    params: {
      size,
      color: {
        color: layoutGrid.color ? rgbToHex(layoutGrid.color) : '#000000',
        opacity: layoutGrid.color ? layoutGrid.color.a : 0
      }
    }
  };
};

const translateRowColsGrid = (layoutGrid: RowsColsLayoutGrid): RowGrid | ColumnGrid => {
  return {
    type: layoutGrid.pattern === 'ROWS' ? 'row' : 'column',
    display: layoutGrid.visible ? layoutGrid.visible : false,
    params: {
      color: {
        color: layoutGrid.color ? rgbToHex(layoutGrid.color) : '#000000',
        opacity: layoutGrid.color ? layoutGrid.color.a : 0
      },
      type: translateGridAlignment(layoutGrid.alignment),
      size: finiteOrUndefined(layoutGrid.count),
      margin: finiteOrUndefined(layoutGrid.offset),
      gutter: finiteOrUndefined(layoutGrid.gutterSize),
      itemLength: finiteOrUndefined(layoutGrid.sectionSize)
    }
  };
};

const translateGridAlignment = (alignment: 'MIN' | 'MAX' | 'STRETCH' | 'CENTER'): GridAlignment => {
  switch (alignment) {
    case 'MIN':
      return 'left';
    case 'MAX':
      return 'right';
    case 'STRETCH':
      return 'stretch';
    case 'CENTER':
      return 'center';
  }
};
