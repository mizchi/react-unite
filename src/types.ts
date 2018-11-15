export type GridData = {
  columns: string[];
  rows: string[];
  areas: string[][];
};

export type EditbalGridData = GridData & {
  controllers: GridControllers;
};

export type GridControllers = {
  verticals: [number, number][];
  horizontals: [number, number][];
  crosses: [number, number][];
  idxMap: { [key: string]: string };
};
