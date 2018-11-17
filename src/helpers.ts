export function interpose<T>(
  list: T[],
  interposer: (a: T, b: T, aIndex: number, bIndex: number) => T
): T[] {
  const r: T[] = [];
  list.forEach((i, idx) => {
    r.push(i);
    if (idx !== list.length - 1) {
      r.push(interposer(list[idx], list[idx + 1], idx, idx + 1));
    }
  });
  return r;
}

export function pixelToNumber(expr: string | number): number {
  if (typeof expr === "number") {
    return expr;
  } else {
    return Number(expr.replace(/px$/, ""));
  }
}

export function fractionToNumber(expr: string | number): number {
  if (typeof expr === "number") {
    return expr;
  } else {
    return Number(expr.replace(/fr$/, ""));
  }
}

export function numberToPixel(expr: number): string {
  return `${expr}px`;
}

export function numberToFraction(expr: number): string {
  return `${expr}fr`;
}

export function exprsToPixels(exprs: string[], maxSize: number): string[] {
  const pxSum = exprs
    .filter(n => n.includes("px"))
    .map(pixelToNumber)
    .reduce((sum, i) => sum + i, 0);
  const frSum = exprs
    .filter(n => n.includes("fr"))
    .map(fractionToNumber)
    .reduce((sum, i) => sum + i, 0);

  const fractionSize = (maxSize - pxSum) / frSum;
  return exprs
    .map(n => {
      if (n.includes("px")) {
        return pixelToNumber(n);
      } else {
        const fr = fractionToNumber(n);
        return fractionSize * fr;
      }
    })
    .map(numberToPixel);
}

export function pixelsToFractions(exprs: string[]): string[] {
  const values = exprs.map(pixelToNumber);
  const minVal = Math.min(...values);
  const fractionsRates = values.map(v => {
    return Math.floor((v / minVal) * 100) / 100;
  });
  return fractionsRates.map(numberToFraction);
}

export function debounce(fn: Function, interval: number = 16) {
  let timerId: number | any;
  return () => {
    clearTimeout(timerId);
    timerId = setTimeout(fn, interval);
  };
}
