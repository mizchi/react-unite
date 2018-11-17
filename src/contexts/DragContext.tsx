import React from "react";

export type DragContextValue = null | {
  windowId: string;
  containerId: string;
};

export const DragContext = React.createContext<DragContextValue>(null as any);
