# flexible-grid

## TODO

- [ ] Publish
- [ ] Join grids and hide controller

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
