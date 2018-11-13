import React, { useState } from "react";
import { GridProps, Grid } from "./Grid";
import {
  gridExprToPixel,
  numberToPixel,
  pixelToNumber,
  buildGridWithControl
} from "./helpers";

function HitArea(props: {
  name: string;
  onDragStart: any;
  onDragEnd: any;
  onDrag: any;
}) {
  return (
    <div
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onDrag={props.onDrag}
      draggable
      style={{
        cursor: "grab",
        gridArea: props.name,
        width: "100%",
        height: "100%",
        outline: "1px solid gray",
        boxSizing: "border-box",
        backgroundColor: "black"
      }}
    />
  );
}

type EditableGridProps = GridProps & {
  spacerSize: number;
  showVertical: boolean;
  showHorizontal: boolean;
  showCrossPoint: boolean;
  hideOnResize: boolean;
};

const EditableGridInner = (props: EditableGridProps) => {
  const {
    children,
    showCrossPoint,
    showHorizontal,
    showVertical,
    hideOnResize,
    ...restProps
  } = props;

  // state
  const [rows, setRows] = useState<string[]>(props.rows);
  const [columns, setColumns] = useState<string[]>(props.columns);
  const [holding, setHolding] = useState<
    ["v" | "h" | "c", number, number, number, number, number[], number[]] | null
  >(null);

  const { controls, ...gridData } = buildGridWithControl(
    {
      rows,
      columns,
      areas: props.areas
    },
    props.spacerSize
  );

  const onDragStartFactory = (type: "v" | "h" | "c", i: number, j: number) => (
    ev: any
  ) => {
    setHolding([
      type,
      i,
      j,
      ev.pageX,
      ev.pageY,
      rows.map(pixelToNumber),
      columns.map(pixelToNumber)
    ]);
    const img = document.createElement("img");
    ev.dataTransfer.setDragImage(img, 0, 0);
  };

  const onDragEnd = () => setHolding(null);

  const onDrag = (event: any) => {
    if (holding) {
      const [
        type,
        i,
        j,
        initialPageX,
        initialPageY,
        lastRows,
        lastColumns
      ] = holding;

      if (type === "v" || type === "c") {
        const dx = event.pageX - initialPageX;
        const leftX = lastColumns[j] + dx;
        const rightX = lastColumns[j + 1] - dx;
        if (leftX > 0 && rightX > 0) {
          const newColumns = lastColumns
            .map((val, idx) => {
              if (idx === j) {
                return leftX;
              } else if (idx === j + 1) {
                return rightX;
              } else {
                return val;
              }
            })
            .map(numberToPixel);
          if (newColumns.join("") !== columns.join("")) {
            setColumns(newColumns);
          }
        }
      }

      if (type === "h" || type === "c") {
        const dy = event.pageY - initialPageY;
        const upperX = lastRows[i] + dy;
        const bottomX = lastRows[i + 1] - dy;
        if (upperX > 0 && bottomX > 0) {
          const newRows = lastRows
            .map((val, idx) => {
              if (idx === i) {
                return upperX;
              } else if (idx === i + 1) {
                return bottomX;
              } else {
                return val;
              }
            })
            .map(numberToPixel);
          if (newRows.join("") !== rows.join("")) {
            setRows(newRows);
          }
        }
      }
    }
  };

  const showChildren = hideOnResize && holding;

  return (
    <Grid
      {...{
        ...restProps,
        ...gridData
      }}
      style={{ backgroundColor: holding && "#ccc" }}
    >
      {!showChildren && children}
      {props.showVertical !== false &&
        controls.verticals.map(([i, j]) => {
          const name = `v-${i}-${j}`;
          return (
            <HitArea
              key={name}
              name={name}
              onDragStart={onDragStartFactory("v", i, j)}
              onDragEnd={onDragEnd}
              onDrag={onDrag}
            />
          );
        })}
      {props.showHorizontal !== false &&
        controls.horizontals.map(([i, j]) => {
          const name = `h-${i}-${j}`;
          return (
            <HitArea
              key={name}
              name={name}
              onDragStart={onDragStartFactory("h", i, j)}
              onDragEnd={onDragEnd}
              onDrag={onDrag}
            />
          );
        })}

      {props.showCrossPoint !== false &&
        controls.crosses.map(([i, j]) => {
          const name = `c-${i}-${j}`;
          return (
            <HitArea
              key={name}
              name={name}
              onDragStart={onDragStartFactory("c", i, j)}
              onDragEnd={onDragEnd}
              onDrag={onDrag}
            />
          );
        })}
    </Grid>
  );
};

export function EditableGrid(props: {
  width: number;
  height: number;
  spacerSize: number;
  rows: string[];
  columns: string[];
  areas: string[][];
  children: React.ReactNode;
  showVertical?: boolean;
  showHorizontal?: boolean;
  showCrossPoint?: boolean;
  hideOnResize?: boolean;
}) {
  // settings
  const {
    width,
    height,
    spacerSize,
    rows,
    columns,
    areas,
    showCrossPoint = true,
    showHorizontal = true,
    showVertical = true,
    hideOnResize = false,
    ...others
  } = props;
  const m = columns.length;
  const n = rows.length;
  const w = width - spacerSize * (m - 1);
  const h = height - spacerSize * (n - 1);
  const gridData = {
    rows: gridExprToPixel(rows, h),
    columns: gridExprToPixel(columns, w),
    areas
  };

  return (
    <EditableGridInner
      width={numberToPixel(width)}
      height={numberToPixel(height)}
      spacerSize={spacerSize}
      showVertical={showVertical}
      showHorizontal={showHorizontal}
      showCrossPoint={showCrossPoint}
      hideOnResize={hideOnResize}
      {...{ ...gridData, ...others }}
    >
      {props.children}
    </EditableGridInner>
  );
}
