import React, { useRef, useState, useLayoutEffect } from "react";

export function Fill(props: {
  children: (width: string, height: string) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useFilledSize(ref);
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      {size && props.children(size[0], size[1])}
    </div>
  );
}

// Edge does not have ResizeObserver
declare var ResizeObserver: any;
function useFilledSize(
  ref: React.RefObject<HTMLDivElement>
): [string, string] | null {
  const [state, setState] = useState<[string, string] | null>(null as any);
  useLayoutEffect(() => {
    if (ref.current && (window as any)["ResizeObserver"]) {
      const s = window.getComputedStyle(ref.current);
      setState([s.width, s.height] as any);
      const observer = (entries: any, _observer: any) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setState([width, height]);
        }
      };
      const ro = new ResizeObserver(observer);
      ro.observe(ref.current);
      return () => ro.unobserve(ref.current);
    }
  }, []);
  return state;
}
