import React, { useRef, useState, useLayoutEffect } from "react";

// TODO: Research AutoSizer
export function Windowed(props: {
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
