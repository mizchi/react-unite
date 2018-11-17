import { LayoutData, ContainerData } from "../types";

export function moveWindowToContainer(
  layout: LayoutData,
  windowId: string,
  containerId: string
): LayoutData {
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
}
