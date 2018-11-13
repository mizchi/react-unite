import { GridDataWithControl, GridControls, GridData } from "./types";

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

export function gridExprToPixel(exprs: string[], maxSize: number): string[] {
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

export function buildGridWithControl(
  original: GridData,
  spacerSize = 16
): GridDataWithControl {
  const controls: GridControls = {
    verticals: [],
    horizontals: [],
    crosses: [],
    idxMap: {}
  };

  // build idx to name

  original.areas.forEach((rows, i) => {
    rows.forEach((name, j) => {
      controls.idxMap[`${i}-${j}`] = name;
    });
  });

  // rebuild rows
  const rows = interpose(original.rows, () => numberToPixel(spacerSize));

  // rebuild columns
  const columns = interpose(original.columns, () => numberToPixel(spacerSize));

  // rebuild areas
  const rowLength = original.areas[0].length;

  const areasRowUpdated = original.areas.map((rows, i) => {
    return interpose(rows, (_0, _1, j) => {
      const t = `v-${i}-${j}`;
      controls.verticals.push([i, j]);
      return t;
    });
  });
  const areas = interpose(areasRowUpdated, (_1, _2, i) => {
    const spaced = new Array(rowLength).fill(0).map((_, j) => {
      const t = `h-${i}-${j}`;
      controls.horizontals.push([i, j]);
      return t;
    });

    return interpose(spaced, (a, _, j) => {
      const t = `c-${i}-${j}`;
      controls.crosses.push([i, j]);
      return t;
    });
  });
  return {
    rows,
    columns,
    areas,
    controls
  };
}
