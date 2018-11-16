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

export type TabData = {
  id: string;
  displayName: string;
};

export type LayoutData = {
  windows: WindowData[];
  tabMap: {
    [key: string]: TabData;
  };
};

export type WindowData = {
  id: string;
  displayName: string;
  selectedId: string;
  tabs: string[];
};
