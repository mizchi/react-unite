import { useLayoutEffect, useState } from "react";
import { debounce } from "../helpers";

export function useWindowSize(): [string | number, string | number] {
  const [state, setState] = useState<[string | number, string | number]>([
    window.innerWidth,
    window.innerHeight
  ]);
  useLayoutEffect(() => {
    const onresize = debounce(() =>
      setState([window.innerWidth, window.innerHeight])
    );
    window.addEventListener("resize", onresize);
    return () => window.removeEventListener("resize", onresize);
  }, []);
  return state;
}

type number_or_string = number | string;
type Size = {
  width: number_or_string;
  height: number_or_string;
};

// Edge does not have ResizeObserver
declare var ResizeObserver: any;
export function useFilledSize(
  ref: React.RefObject<HTMLDivElement>
): Size | null {
  const [state, setState] = useState<Size | null>(null as any);
  useLayoutEffect(() => {
    if (ref.current && (window as any)["ResizeObserver"]) {
      // set initial state
      const s = window.getComputedStyle(ref.current);
      setState({ width: s.width, height: s.height });

      const observer = (entries: any, _observer: any) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setState({ width, height });
        }
      };
      const ro = new ResizeObserver(observer);
      ro.observe(ref.current);
      return () => ro.unobserve(ref.current);
    }
  }, [ref]);
  return state;
}
