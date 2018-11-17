# EditableLayout

WIP

## TODO

- [ ] Swap window on drop
- [ ] resizableRows|Columns option
- [ ] Resizable Box
- [ ] Quit x-pane in src
- [ ] Publish

## How to use

```tsx
import React from "react";
import ReactDOM from "react-dom";
import { EditableGrid, GridArea } from "../src";

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
      <x-pane>a</x-pane>
    </GridArea>
    <GridArea name="b">
      <x-pane>b</x-pane>
    </GridArea>
    <GridArea name="d">
      <x-pane>d</x-pane>
    </GridArea>
    <GridArea name="f">
      <x-pane>f</x-pane>
    </GridArea>
    <GridArea name="h">
      <x-pane>h</x-pane>
    </GridArea>
    <GridArea name="l">
      <x-pane>l</x-pane>
    </GridArea>
  </EditableGrid>,
  root
);
```

[demo](https://admiring-curie-8355d7.netlify.com)

## How to dev

- `yarn dev`: Start application server on `http://localhost:1234`
- `yarn build`: Generate `dist`
- `yarn test`: Run jest
- `yarn deploy`: Deploy to netlify (need netlify account)

## Write your grid renderer

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

## LICENSE

MIT
