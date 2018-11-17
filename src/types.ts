export type GridData = {
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
  containers: ContainerData[];
  tabMap: {
    [key: string]: WindowData;
  };
};

export type ContainerData = {
  id: string;
  displayName: string;
  selectedId: string;
  tabs: string[];
};

export type Controllers = {
  verticals: [number, number][];
  horizontals: [number, number][];
  crosses: [number, number][];
  idxMap: { [key: string]: string };
};
