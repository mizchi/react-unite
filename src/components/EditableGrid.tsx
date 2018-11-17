import React, { useState } from "react";
import { GridData } from "../types";
import { Grid } from "./Grid";
import { buildEditableGridData } from "../buildEditableGridData";
import { exprsToPixels, numberToPixel, pixelToNumber } from "../helpers";
import { HitArea } from "./HitArea";

type Props = {
  width: number | string;
  height: number | string;
  spacerSize: number;
  rows: string[];
  columns: string[];
  areas: string[][];
  children: React.ReactNode;
  showVertical?: boolean;
  showHorizontal?: boolean;
  showCrossPoint?: boolean;
  hideOnResize?: boolean;
  onChangeGridData?: (data: GridData) => void;
};

export function EditableGrid({
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
  onChangeGridData,
  children
}: Props) {
  const m = columns.length;
  const n = rows.length;
  const w = pixelToNumber(width) - spacerSize * (m - 1);
  const h = pixelToNumber(height) - spacerSize * (n - 1);
  const original = {
    rows: exprsToPixels(rows, h),
    columns: exprsToPixels(columns, w),
    areas
  };

  return (
    <EditableGridInner
      original={original}
      showVertical={showVertical}
      showHorizontal={showHorizontal}
      showCrossPoint={showCrossPoint}
      hideOnResize={hideOnResize}
      spacerSize={spacerSize}
      onChangeGridData={onChangeGridData}
    >
      {children}
    </EditableGridInner>
  );
}

type InnerProps = {
  original: GridData;
  children: any;
  spacerSize: number;
  showVertical: boolean;
  showHorizontal: boolean;
  showCrossPoint: boolean;
  hideOnResize: boolean;
  onChangeGridData?: (data: GridData) => void;
};

type HoldingController = {
  type: "v" | "h" | "c";
  row: number;
  column: number;
  initialX: number;
  initialY: number;
  startRows: number[];
  startColumns: number[];
};

const EditableGridInner = ({
  original,
  children,
  spacerSize,
  showCrossPoint,
  showHorizontal,
  showVertical,
  hideOnResize,
  onChangeGridData
}: InnerProps) => {
  // state

  const [semanticRows, setSemanticRows] = useState<string[]>(original.rows);
  const [semanticColumns, setSemanticColumns] = useState<string[]>(
    original.columns
  );

  const { controllers, ...editable } = buildEditableGridData(
    {
      rows: semanticRows,
      columns: semanticColumns,
      areas: original.areas
    },
    spacerSize
  );

  const [holding, setHolding] = useState<HoldingController | null>(null);

  const onDragStartFactory = (type: "v" | "h" | "c", i: number, j: number) => (
    ev: any
  ) => {
    ev.dataTransfer.effectAllowed = "move";
    setHolding({
      type,
      row: i,
      column: j,
      initialX: ev.pageX,
      initialY: ev.pageY,
      startRows: semanticRows.map(pixelToNumber),
      startColumns: semanticColumns.map(pixelToNumber)
    });
  };

  const onDragEnd = () => {
    setHolding(null);
    onChangeGridData &&
      onChangeGridData({
        ...original,
        rows: semanticRows,
        columns: semanticColumns
      });
  };

  const onDrag = (event: any) => {
    if (holding) {
      const {
        type,
        row: i,
        column: j,
        initialX,
        initialY,
        startRows: lastRows,
        startColumns: lastColumns
      } = holding;

      if (type === "v" || type === "c") {
        const dx = event.pageX - initialX;
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

          if (newColumns.join("") !== semanticColumns.join("")) {
            setSemanticColumns(newColumns);
          }
        }
      }

      if (type === "h" || type === "c") {
        const dy = event.pageY - initialY;
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
          if (newRows.join("") !== semanticRows.join("")) {
            setSemanticRows(newRows);
          }
        }
      }
    }
  };

  const showChildren = hideOnResize && holding;

  return (
    <Grid
      {...editable}
      style={{
        cursor: holding ? "grabbing" : "auto"
      }}
      onDragOver={(ev: any) => {
        holding && ev.preventDefault();
      }}
    >
      {!showChildren && children}

      {/* show controllers */}
      {showVertical &&
        controllers.verticals.map(([i, j]) => {
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
      {showHorizontal &&
        controllers.horizontals.map(([i, j]) => {
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
      {showCrossPoint &&
        controllers.crosses.map(([i, j]) => {
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
