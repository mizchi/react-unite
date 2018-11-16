import React, { useRef, useState, useLayoutEffect, useCallback } from "react";

export type WindowData = {
  id: string;
  displayName: string;
};

function TabButton(props: {
  id: string;
  displayName: string;
  selected?: boolean;
  onClick: (event: Event) => void;
  onDragStart?: (ev: DragEvent) => void;
  onDragEnd?: (ev: DragEvent) => void;
  onDrag?: (ev: DragEvent) => void;
  onDrop?: (ev: DragEvent) => void;
}) {
  return (
    <x-pane
      onClick={props.onClick as any}
      draggable
      onDragStart={props.onDragStart as any}
      onDragEnd={props.onDragEnd as any}
      onDrag={props.onDrag as any}
      onDrop={props.onDrop as any}
      style={{
        borderRight: "1px solid rgba(0,0,0,0.4)",
        minWidth: "50px",
        height: "100%",
        background: props.selected ? "#fff" : "#aaa",
        borderBottom: "1px solid rgba(0,0,0, 0.4)"
      }}
    >
      {props.displayName}
    </x-pane>
  );
}

function TabSelector(props: {
  tabs: Array<{ displayName: string; id: string; icon?: string }>;
  selectedId: string;
  onSelectTab: (id: string) => (ev: Event) => void;
  // onDragStartTab?: (id: string) => (ev: Event) => void;
  // onDragEndTab?: (id: string) => (ev: Event) => void;
  // onDropTab?: (id: string) => (ev: Event) => void;
  onDrop?: (ev: DragEvent) => void;
}) {
  return (
    <x-view
      // onDragEnter={ev => {
      //   console.log("enter target");
      // }}
      // onDragLeave={ev => {
      //   console.log("leave target");
      // }}
      onDragOver={ev => {
        ev.preventDefault();
      }}
      onDrop={props.onDrop as any}
      style={{
        height: 30,
        backgroundColor: "wheat",
        width: "100%",
        flexDirection: "row"
      }}
    >
      {props.tabs.map(tab => {
        return (
          <TabButton
            key={tab.id}
            id={tab.id}
            displayName={tab.displayName}
            selected={tab.id === props.selectedId}
            onClick={props.onSelectTab(tab.id)}
            onDragStart={ev => {
              if (ev.dataTransfer) {
                ev.dataTransfer.effectAllowed = "drop";
                ev.dataTransfer.setData("text", tab.id);
              }
            }}
          />
        );
      })}
    </x-view>
  );
}

export function Window({
  id,
  tabs,
  selectedId,
  renderContent,
  onSelectTab,
  onDropTab
}: {
  id: string;
  tabs: WindowData[];
  selectedId: string;
  renderContent: (id: string) => React.ReactNode;
  onSelectTab: (tabId: string) => (ev: Event) => void;
  onDropTab: (tabId: string) => (ev: DragEvent) => void;
}) {
  const onDrop = useCallback((ev: DragEvent) => {
    if (ev.dataTransfer) {
      const tabId = ev.dataTransfer.getData("text");
      onDropTab(tabId)(ev);
    }
  }, []);

  return (
    <x-pane style={{ flexDirection: "column" }}>
      <TabSelector
        tabs={tabs}
        selectedId={selectedId}
        onSelectTab={onSelectTab}
        onDrop={onDrop}
      />
      <x-pane style={{ flex: 1, background: "white" }}>
        {renderContent(selectedId)}
      </x-pane>
    </x-pane>
  );
}

export function Fullscreen(props: {
  children: (width: string, height: string) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, height] = useWindowSize(ref);
  return (
    <x-view
      ref={ref}
      style={{
        width: "100vw",
        height: "100vh"
      }}
    >
      {props.children(width, height)}
    </x-view>
  );
}

function useWindowSize(ref: React.RefObject<HTMLDivElement>): [string, string] {
  const [state, setState] = useState<[string, string]>([
    window.innerWidth,
    window.innerHeight
  ] as any);

  useLayoutEffect(() => {
    if (ref.current) {
      const s = window.getComputedStyle(ref.current);
      setState([s.width, s.height] as any);
    }

    const onresize = () => {
      setState([window.innerWidth, window.innerHeight] as any);
    };
    window.addEventListener("resize", onresize);
    return () => window.removeEventListener("resize", onresize);
  }, []);

  return state;
}
