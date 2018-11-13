export type GridData = {
  columns: string[];
  rows: string[];
  areas: string[][];
};

export type GridDataWithControl = GridData & {
  controls: GridControls;
};

export type GridControls = {
  verticals: [number, number][];
  horizontals: [number, number][];
  crosses: [number, number][];
  idxMap: { [key: string]: string };
};
