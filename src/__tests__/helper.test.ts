import { buildGridWithControl } from "./../helpers";
import assert from "assert";

test("complex 4x3", () => {
  const columns = ["100px", "1fr", "1fr", "100px"];
  const rows = ["1fr", "2fr", "1fr"];
  const areas = [
    ["a", "b", "c", "d"],
    ["e", "f", "g", "h"],
    ["j", "k", "l", "m"]
  ];

  const built = buildGridWithControl({ rows, columns, areas }, 16);
  // console.log(built);
  assert(1 === 1);
});

test("2x1 a-b", () => {
  const columns = ["100px", "1fr"];
  const rows = ["1fr"];
  const areas = [["a", "b"]];
  const built = buildGridWithControl({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a", "v-0-0", "b"]]);
});

test("2x1 horizontal connect", () => {
  const columns = ["1fr", "1fr"];
  const rows = ["1fr"];
  const areas = [["a", "a"]];
  const built = buildGridWithControl({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a", "a", "a"]]);
});

test("1x2 vertical not connected", () => {
  const columns = ["1fr"];
  const rows = ["1fr", "1fr"];
  const areas = [["a"], ["b"]];
  const built = buildGridWithControl({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a"], ["h-0-0"], ["b"]]);
});

test("1x2 vertical connect", () => {
  const columns = ["1fr"];
  const rows = ["1fr", "1fr"];
  const areas = [["a"], ["a"]];
  const built = buildGridWithControl({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a"], ["a"], ["a"]]);
});

test("1x3 vertical connect", () => {
  const columns = ["1fr"];
  const rows = ["1fr", "1fr", "1fr"];
  const areas = [["a"], ["b"], ["b"]];
  const built = buildGridWithControl({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a"], ["h-0-0"], ["b"], ["b"], ["b"]]);
});
