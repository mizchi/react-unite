import { LayoutData, ContainerData } from "../types";

export function moveWindowToContainer(
  layout: LayoutData,
  windowId: string,
  containerId: string,
  droppedWindowId: string | null,
  droppedContainerId: string | null
): LayoutData {
  // if (containerId !== droppedContainerId) {
  const newContainers: ContainerData[] = layout.containers.map(w => {
    let ids = w.windowIds;
    let selectedId = w.selectedId;
    if (w.id === containerId) {
      ids = w.windowIds.includes(windowId)
        ? w.windowIds
        : [...w.windowIds, windowId];
      selectedId = windowId;
    } else {
      ids = w.windowIds.filter(t => t !== windowId);
      if (windowId === w.selectedId) {
        selectedId = ids[0];
      }
    }
    return { ...w, windowIds: ids, selectedId };
  });

  return { ...layout, containers: newContainers };
  // } else {
  //   return layout;
  // }
}

export function selectWindowOnContainer(
  layout: LayoutData,
  windowId: string,
  containerId: String
) {
  const newContainers = layout.containers.map(c => {
    if (containerId === c.id) {
      return { ...c, selectedId: windowId };
    } else {
      return c;
    }
  });
  return { ...layout, containers: newContainers };
}
