import React, { useRef, useState, useLayoutEffect } from "react";
import { debounce } from "../helpers";

// TODO: Research AutoSizer
export function Windowed(props: {
  children: (width: string, height: string) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, height] = useWindowSize(ref);
  return (
    <div
      ref={ref}
      style={{
        width: "100vw",
        height: "100vh"
      }}
    >
      {props.children(width, height)}
    </div>
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
    const onresize = debounce(() => {
      setState([window.innerWidth, window.innerHeight] as any);
    });

    window.addEventListener("resize", onresize);
    return () => window.removeEventListener("resize", onresize);
  }, []);
  return state;
}
