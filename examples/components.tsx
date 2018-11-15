import React, { useRef, useState, useLayoutEffect } from "react";

export type WindowData = {
  id: string;
  displayName: string;
};

function TabButton(props: {
  displayName: string;
  selected?: boolean;
  onClick: (event: Event) => void;
}) {
  return (
    <x-pane
      onClick={props.onClick as any}
      draggable
      onDragOver={ev => {
        ev.preventDefault();
      }}
      onDragStart={ev => {
        console.log("on drag start");
        // ev.dataTransfer.effectAllowed = "move";
        // ev.dataTransfer.setData("text", "hello");
      }}
      onDrop={() => {
        console.log("dropped tab");
      }}
      style={{
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
  onSelectTab: (ev: Event, id: string) => void;
}) {
  return (
    <x-view
      onDragEnter={ev => {
        ev.preventDefault();
        console.log("enter target");
        ev.dataTransfer.dropEffect = "move";
      }}
      onDragLeave={ev => {
        ev.preventDefault();

        ev.dataTransfer.dropEffect = "move";
        console.log("leave target");
      }}
      onDrop={() => {
        console.log("dropped");
      }}
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
            displayName={tab.displayName}
            selected={tab.id === props.selectedId}
            onClick={ev => props.onSelectTab(ev, tab.id)}
          />
        );
      })}
    </x-view>
  );
}

export function WindowsContainer({
  tabs,
  selectedId,
  onSelectTab
}: {
  tabs: WindowData[];
  selectedId: string;
  onSelectTab: (ev: Event, id: string) => void;
}) {
  return (
    <x-pane style={{ flexDirection: "column" }}>
      <TabSelector
        tabs={tabs}
        selectedId={selectedId}
        onSelectTab={onSelectTab}
      />
      <x-pane style={{ flex: 1, background: "white" }}>
        <x-pane>body</x-pane>
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
