import { useLayoutEffect, useState } from "react";
import { debounce } from "../helpers";
type number_or_string = number | string;
type Size = {
  width: number_or_string;
  height: number_or_string;
};

export function useWindowSize(): Size {
  const [state, setState] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight
  });
  useLayoutEffect(() => {
    const onresize = debounce(() =>
      setState({ width: window.innerWidth, height: window.innerHeight })
    );
    window.addEventListener("resize", onresize);
    return () => window.removeEventListener("resize", onresize);
  }, []);
  return state;
}

// Edge does not have ResizeObserver
declare var ResizeObserver: any;
export function useElementSize(
  ref: React.RefObject<HTMLDivElement>
): Size | null {
  const [state, setState] = useState<Size | null>(null as any);
  useLayoutEffect(() => {
    if (ref.current && (window as any)["ResizeObserver"]) {
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
