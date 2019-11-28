import React, { useContext } from "react";

export type ThemeContextValue = {
  uiBaseColor: string;
  uiDisabledColor: string;
  hoverredTabColor: string;
  draggingTabColor: string;
  draggingColor: string;
  overlayColor: string;
  unoverlayColor: string;
};

const DefaultTheme: ThemeContextValue = {
  uiBaseColor: "#888",
  uiDisabledColor: "#666",
  hoverredTabColor: "red",
  draggingTabColor: "blue",
  draggingColor: "1px solid rgba(0,0,255, 0.8)",
  overlayColor: "1px solid rgba(255,0,0, 0.8)",
  unoverlayColor: "transparent"
};

export const ThemeContext = React.createContext<ThemeContextValue>(
  DefaultTheme
);

export function useTheme() {
  return useContext(ThemeContext);
}
