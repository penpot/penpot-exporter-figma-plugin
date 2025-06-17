import {
  GridLayoutGrid,
  LayoutGrid,
  RowsColsLayoutGrid
} from '@figma/plugin-typings/plugin-api-standalone';

import { rgbToHex } from '@plugin/utils';

import { ColumnGrid, Grid, GridAlignment, RowGrid, SquareGrid } from '@ui/lib/types/utils/grid';

export const translateGrids = (layoutGrids: readonly LayoutGrid[]): Grid[] => {
  return layoutGrids.map(grid => {
    switch (grid.pattern) {
      case 'GRID':
        return translateSquareGrid(grid);
      case 'ROWS':
        return translateRowColsGrid(grid);
      case 'COLUMNS':
        return translateRowColsGrid(grid);
    }
  });
};

const translateSquareGrid = (layoutGrid: GridLayoutGrid): SquareGrid => {
  return {
    type: 'square',
    display: layoutGrid.visible ? layoutGrid.visible : false,
    params: {
      size: layoutGrid.sectionSize,
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
      size: layoutGrid.count,
      margin: layoutGrid.offset,
      gutter: layoutGrid.gutterSize,
      itemLength: layoutGrid.sectionSize
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
