import React, { useState, useCallback } from "react";
import { GridData } from "../types";
import { Grid } from "./Grid";
import { buildEditableGridData } from "../api/grid";
import {
  exprsToPixels,
  numberToPixel,
  pixelToNumber,
  pixelsToFractions
} from "../helpers";
import { HitArea } from "./HitArea";

type Props = {
  width: number | string;
  height: number | string;
  spacerSize: number;
  rows: string[];
  fixedRows?: (string | boolean)[];
  columns: string[];
  fixedColumns?: (string | boolean)[];

  areas: string[][];
  children: React.ReactNode;
  showVertical?: boolean;
  showHorizontal?: boolean;
  showCrossPoint?: boolean;
  hideOnResize?: boolean;
  onChangeGridData?: (data: GridData) => void;
  onDragStart?: Function;
  onDragEnd?: Function;
};

export function EditableGrid({
  width,
  height,
  spacerSize,
  rows,
  columns,
  fixedRows,
  fixedColumns,
  areas,
  showCrossPoint = true,
  showHorizontal = true,
  showVertical = true,
  hideOnResize = false,
  onChangeGridData,
  onDragStart,
  onDragEnd,
  children
}: Props) {
  const m = columns.length;
  const n = rows.length;
  const w = pixelToNumber(width) - spacerSize * (m - 1);
  const h = pixelToNumber(height) - spacerSize * (n - 1);
  const original = {
    fixedRows,
    fixedColumns,
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
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
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
  onDragStart?: Function;
  onDragEnd?: Function;
  onChangeGridData?: (data: GridData) => void;
};

enum HoldingType {
  Vertical = "v",
  Horizontal = "h",
  Center = "c"
}

type HoldingController = {
  type: HoldingType;
  row: number;
  column: number;
  initialX: number;
  initialY: number;
  startRows: number[];
  startColumns: number[];
};

function EditableGridInner({
  original,
  children,
  spacerSize,
  showCrossPoint,
  showHorizontal,
  showVertical,
  hideOnResize,
  onDragStart: parentOnDragStart,
  onDragEnd: parentOnDragEnd,
  onChangeGridData
}: InnerProps) {
  console.log("editable grid inner", original);
  // state

  const [semanticRows, setSemanticRows] = useState<string[]>(original.rows);
  const [semanticColumns, setSemanticColumns] = useState<string[]>(
    original.columns
  );

  const { controllers, ...editable } = buildEditableGridData(
    {
      rows: semanticRows,
      fixedRows: original.fixedRows,
      columns: semanticColumns,
      fixedColumns: original.fixedColumns,
      areas: original.areas
    },
    spacerSize
  );

  const [holding, setHolding] = useState<HoldingController | null>(null);

  const onDragStartFactory = (
    type: HoldingType,
    row: number,
    column: number
  ) => (ev: any) => {
    ev.dataTransfer.effectAllowed = "move";
    setHolding({
      type,
      row,
      column,
      initialX: ev.pageX,
      initialY: ev.pageY,
      startRows: semanticRows.map(pixelToNumber),
      startColumns: semanticColumns.map(pixelToNumber)
    });
    parentOnDragStart?.();
  };

  const onDragEnd = useCallback(() => {
    setHolding(null);
    const rows = pixelsToFractions(semanticRows);
    const columns = pixelsToFractions(semanticColumns);
    onChangeGridData?.({
      ...original,
      rows,
      columns
    });
    // console.log("semantic", semanticRows, semanticColumns);
    parentOnDragEnd?.();
  }, [original, semanticRows, semanticColumns]);

  const onDrag = useCallback(
    (event: any) => {
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

        if (type === HoldingType.Vertical || type === HoldingType.Center) {
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
    },
    [holding]
  );

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
        controllers.verticals.map(([row, column]) => {
          const name = `v-${row}-${column}`;
          const disabled = !!(
            original.fixedColumns && original.fixedColumns[column]
          );
          return (
            <HitArea
              disabled={disabled}
              key={name}
              name={name}
              onDragStart={onDragStartFactory(
                HoldingType.Vertical,
                row,
                column
              )}
              onDragEnd={onDragEnd}
              onDrag={onDrag}
            />
          );
        })}
      {showHorizontal &&
        controllers.horizontals.map(([row, column]) => {
          const name = `h-${row}-${column}`;
          const disabled = !!(original.fixedRows && original.fixedRows[row]);
          return (
            <HitArea
              key={name}
              name={name}
              disabled={disabled}
              onDragStart={onDragStartFactory(
                HoldingType.Horizontal,
                row,
                column
              )}
              onDragEnd={onDragEnd}
              onDrag={onDrag}
            />
          );
        })}
      {showCrossPoint &&
        controllers.crosses.map(([row, column]) => {
          const name = `c-${row}-${column}`;
          const vDisabled = !!(
            original.fixedColumns && original.fixedColumns[column]
          );
          const hDisabled = !!(original.fixedRows && original.fixedRows[row]);

          return (
            <HitArea
              key={name}
              name={name}
              disabled={hDisabled || vDisabled}
              onDragStart={onDragStartFactory(HoldingType.Center, row, column)}
              onDragEnd={onDragEnd}
              onDrag={onDrag}
            />
          );
        })}
    </Grid>
  );
}
