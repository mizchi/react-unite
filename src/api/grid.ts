import { interpose, numberToPixel } from "../helpers";
import { EditbalGridData, GridData, Controllers } from "../types";

export function buildEditableGridData(
  original: GridData,
  spacerSize = 16
): EditbalGridData {
  const controllers: Controllers = {
    verticals: [],
    horizontals: [],
    crosses: [],
    idxMap: {}
  };

  // build idx to name

  original.areas.forEach((rows, i) => {
    rows.forEach((name, j) => {
      controllers.idxMap[`${i}-${j}`] = name;
    });
  });

  // rebuild rows
  const rows = interpose(original.rows, () => numberToPixel(spacerSize));

  // rebuild columns
  const columns = interpose(original.columns, () => numberToPixel(spacerSize));

  // rebuild areas
  const rowLength = original.areas[0].length;

  const areasRowUpdated = original.areas.map((rows, i) => {
    return interpose(rows, (a, b, j) => {
      if (a === b) {
        return a;
      } else {
        const t = `v-${i}-${j}`;
        controllers.verticals.push([i, j]);
        return t;
      }
    });
  });

  // TODO: connect with vertical
  const areas = interpose(areasRowUpdated, (_0, _1, i) => {
    const spaced = new Array(rowLength).fill(0).map((_, j) => {
      if (original.areas[i][j] === original.areas[i + 1][j]) {
        return original.areas[i][j];
      } else {
        const t = `h-${i}-${j}`;
        controllers.horizontals.push([i, j]);
        return t;
      }
    });

    return interpose(spaced, (a, _, j) => {
      if (
        original.areas[i][j] === original.areas[i + 1][j] &&
        original.areas[i][j] === original.areas[i][j + 1] &&
        original.areas[i][j] === original.areas[i + 1][j + 1]
      ) {
        return original.areas[i][j];
      }

      const t = `c-${i}-${j}`;
      controllers.crosses.push([i, j]);
      return t;
    });
  });
  return {
    rows,
    columns,
    areas,
    controllers
  };
}
