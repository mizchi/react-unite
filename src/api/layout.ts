import { LayoutData, PaneData } from "../types";

export function moveWindowToContainer(
  layout: LayoutData,
  fromWindowId: string,
  fromContainerId: string,
  toWindowId: string | null,
  toContainerId: string
): LayoutData {
  if (toContainerId === fromContainerId && toWindowId) {
    // replace windows in container
    const newConatiners = layout.panes.map(c => {
      if (c.id !== toContainerId) {
        return c;
      }
      // let selectedId = c.selectedId;
      const newWindowIds = c.windowIds.map(wid => {
        if (wid === fromWindowId) {
          return toWindowId;
        } else if (wid === toWindowId) {
          return fromWindowId;
        } else {
          return wid;
        }
      });
      return { ...c, windowIds: newWindowIds };
    });
    return { ...layout, panes: newConatiners };
  } else {
    // send window to other container
    const newPanes: PaneData[] = layout.panes.map(c => {
      let ids = c.windowIds;
      let selectedId = c.selectedId;
      if (c.id === toContainerId) {
        ids = c.windowIds.includes(fromWindowId)
          ? c.windowIds
          : [...c.windowIds, fromWindowId];
        selectedId = fromWindowId;
      } else {
        ids = c.windowIds.filter(i => i !== fromWindowId);
        if (fromWindowId === c.selectedId) {
          selectedId = ids[0];
        }
      }
      return { ...c, windowIds: ids, selectedId };
    });
    return { ...layout, panes: newPanes };
  }
}

export function selectWindowOnContainer(
  layout: LayoutData,
  windowId: string,
  containerId: String
) {
  const newPanes = layout.panes.map(c => {
    if (containerId === c.id) {
      return { ...c, selectedId: windowId };
    } else {
      return c;
    }
  });
  return { ...layout, panes: newPanes };
}
