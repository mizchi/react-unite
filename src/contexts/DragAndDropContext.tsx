import React from "react";

export type DragAndDropContextValue = {
  dragging: null | {
    windowId: string;
    containerId: string;
  };
};

export const DragAndDropContext = React.createContext<DragAndDropContextValue>(
  null as any
);
