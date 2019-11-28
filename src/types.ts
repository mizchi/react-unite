export type GridData = {
  fixedColumns?: (string | boolean)[];
  fixedRows?: (string | boolean)[];
  columns: string[];
  rows: string[];
  areas: string[][];
};

export type EditbalGridData = GridData & {
  controllers: Controllers;
};

export type WindowData = {
  id: string;
  displayName: string;
};

export type LayoutData = {
  grid: GridData;
  panes: PaneData[];
  windows: {
    [key: string]: WindowData;
  };
};

export type PaneData = {
  id: string;
  displayName?: string;
  selectedId?: string;
  showTab?: boolean;
  windowIds: string[];
};

export type Controllers = {
  verticals: [number, number][];
  horizontals: [number, number][];
  crosses: [number, number][];
  idxMap: { [key: string]: string };
};
