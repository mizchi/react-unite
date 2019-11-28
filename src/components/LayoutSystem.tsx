import React, {
  Suspense,
  useCallback,
  useContext,
  useState,
  useEffect
} from "react";
import { WindowData, LayoutData } from "../types";
import { EditableLayout } from "./EditableLayout";

const DraggingContext = React.createContext(false);
export function useDragging(): boolean {
  return useContext(DraggingContext);
}

const WindowManagerContext = React.createContext<WindowManager>(null as any);
export function useWindowManager(): WindowManager {
  return useContext(WindowManagerContext);
}

function WindowSelector(props: { data: WindowData }) {
  const dragging = useDragging();
  const windowManager = useWindowManager();
  const [age, setAge] = useState(0);

  useEffect(() => {
    const unlisten = windowManager.subscribe(() => {
      setAge(age + 1);
    });
    return () => unlisten();
  }, [age]);

  if (dragging) {
    return (
      <div
        style={{
          outline: "10px solid white",
          boxSizing: "border-box",
          backgroundColor: "#aaa",
          width: "100%",
          height: "100%"
        }}
      ></div>
    );
  }
  const Current = windowManager.getWindow(props.data.id);
  if (Current) {
    return (
      <Suspense fallback="loading...">
        <Current data={props.data} />
      </Suspense>
    );
  } else {
    return (
      <span>
        {props.data.id}: {props.data.displayName}
      </span>
    );
  }
}

export function LayoutSystem(props: {
  width: any;
  height: any;
  windowManager: WindowManager;
  initialLayout: LayoutData;
  spacerSize?: number;
}) {
  const [dragging, setDragging] = useState(false);
  const onDragStart = useCallback(() => {
    setDragging(true);
  }, []);
  const onDragEnd = useCallback(() => {
    setDragging(false);
  }, []);
  const renderWindow = useCallback((win: WindowData) => {
    return <WindowSelector data={win} />;
  }, []);
  const renderTab = useCallback((data: WindowData) => {
    return <span>{data.displayName}</span>;
  }, []);

  return (
    <WindowManagerContext.Provider value={props.windowManager}>
      <DraggingContext.Provider value={dragging}>
        <EditableLayout
          spacerSize={props.spacerSize}
          width={props.width}
          height={props.height}
          layout={props.initialLayout}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          renderTab={renderTab}
          renderWindow={renderWindow}
        />
      </DraggingContext.Provider>
    </WindowManagerContext.Provider>
  );
}

export class WindowManager<WindowID = string> {
  private _changeCounter = 0;
  private _listeners: Function[] = [];

  subscribe(fn: Function): Function {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(f => f !== fn);
    };
  }

  private _componentMap: Map<WindowID, React.ComponentType<any>> = new Map();
  registerWindow(
    windowId: WindowID,
    loader: React.LazyExoticComponent<any> | React.FC<any>
  ) {
    this._componentMap.set(windowId, loader);
    this._change();
  }

  getWindow(windowId: WindowID) {
    return this._componentMap.get(windowId);
  }

  private _change() {
    this._changeCounter++;
    this._listeners.forEach(f => f());
  }
}
