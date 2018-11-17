# react-unite

Editable Grid & Layout

![](https://i.gyazo.com/a4781fc08dd2dd96b0db5aea61563d57.gif)

```
yarn add react-unite
```

CAUTION: `react-unite` require `react@16.7.0-alpha.0` & `react-dom@16.7.0-alpha.0` to use react-hooks.

Sample project https://github.com/mizchi-sandbox/minfront

## Concept

- inspired by Unity3D layout system
- `react-unite` generates `display: grid` properties.

See also https://mizchi-sandbox.github.io/grid-generator/

## EditableGrid (typescript)

```tsx
import React from "react";
import ReactDOM from "react-dom";
import { EditableGrid, GridArea } from "react-unite";

const rows = ["1fr", "2fr", "1fr"];
const columns = ["100px", "1fr", "1fr", "100px"];
const areas = [
  ["a", "b", "c", "d"],
  ["e", "f", "g", "h"],
  ["j", "k", "l", "m"]
];

const root = document.querySelector(".root");
ReactDOM.render(
  <EditableGrid
    width={640}
    height={480}
    spacerSize={16}
    rows={rows}
    columns={columns}
    areas={areas}
  >
    <GridArea name="a">
      <div>a</div>
    </GridArea>
    <GridArea name="b">
      <div>b</div>
    </GridArea>
    <GridArea name="d">
      <div>d</div>
    </GridArea>
    <GridArea name="f">
      <div>f</div>
    </GridArea>
    <GridArea name="h">
      <div>h</div>
    </GridArea>
    <GridArea name="l">
      <div>l</div>
    </GridArea>
  </EditableGrid>,
  root
);
```

## EditableLayout (typescript)

```tsx
import React from "react";
import ReactDOM from "react-dom";
import { LayoutData, Windowed, EditableLayout } from "react-unite";

const initialLayoutData: LayoutData = {
  grid: {
    columns: ["1fr", "1fr"],
    rows: ["40px", "1fr", "1fr"],
    areas: [
      ["header", "header"],
      ["preview", "inspector"],
      ["assets", "inspector"]
    ]
  },
  windowMap: {
    "#scene": { displayName: "Scene", id: "#scene" },
    "#project": { displayName: "Project", id: "#project" },
    "#hierachy": { displayName: "Hierachy", id: "#hierachy" },
    "#inspector": { displayName: "Inspector", id: "#inspector" },
    "#services": { displayName: "Services", id: "#services" }
  },
  containers: [
    {
      id: "preview",
      displayName: "Preview",
      selectedId: "#scene",
      windowIds: ["#scene"]
    },
    {
      id: "assets",
      displayName: "Preview",
      selectedId: "#project",
      windowIds: ["#project", "#hierachy"]
    },
    {
      id: "inspector",
      displayName: "Inspector",
      selectedId: "#inspector",
      windowIds: ["#inspector", "#services"]
    }
  ]
};

// To fill window, Set css `html, body { margin: 0;}`
const MyLayout = () => {
  return (
    <Windowed>
      {(width, height) => (
        <EditableLayout
          width={width}
          height={height}
          layout={initialLayoutData}
          renderTab={data => {
            return <span>{data.displayName}</span>;
          }}
          renderWindow={win => {
            return (
              <div>
                {win.id}: {win.displayName}
              </div>
            );
          }}
        />
      )}
    </Windowed>
  );
};

const root = document.querySelector(".root");
ReactDOM.render(<MyLayout />, root);
```

## How to dev

- `yarn build`: Generate `dist` by rollup
- `yarn test`: Run jest

## Write your own grid renderer

```tsx
import styled from "styled-components";
export const Grid: React.ComponentClass<GridProps> = styled.div`
  display: grid;
  width: ${(p: GridProps) => p.width || "100%"};
  height: ${(p: GridProps) => p.height || "100%"};
  grid-template-columns: ${(p: GridProps) => p.columns.join(" ")};
  grid-template-rows: ${(p: GridProps) => p.rows.join(" ")};
  grid-template-areas: ${(p: GridProps) =>
    p.areas.map(row => "'" + row.join(" ") + "'").join(" ")};
`;
```

## TODO

- [x] Publish
- [x] Swap window on drop
- [x] Remove div in src
- [x] `renderTab`
- [x] Visual Effect on dragStart and dragEnd
- [x] Fill Component
- [ ] `containerType`: one | tabs | nest
- [ ] ResizableBox
- [ ] Option: `resizableRows`
- [ ] Option: `resizableColumns`
- [ ] Option: `minimumWindowWidth`
- [ ] Option: `minimumWindowHeight`
- [ ] Option: `editable: boolean`

## LICENSE

MIT
