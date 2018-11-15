import { buildEditableGridData } from "../buildEditableGridData";
import assert from "assert";

test("2x1 a-b", () => {
  const columns = ["1fr", "1fr"];
  const rows = ["1fr"];
  const areas = [["a", "b"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a", "v-0-0", "b"]]);
});

test("2x1 horizontal connect", () => {
  const columns = ["1fr", "1fr"];
  const rows = ["1fr"];
  const areas = [["a", "a"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a", "a", "a"]]);
});

test("1x2 vertical not connected", () => {
  const columns = ["1fr"];
  const rows = ["1fr", "1fr"];
  const areas = [["a"], ["b"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a"], ["h-0-0"], ["b"]]);
});

test("1x2 vertical connect", () => {
  const columns = ["1fr"];
  const rows = ["1fr", "1fr"];
  const areas = [["a"], ["a"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a"], ["a"], ["a"]]);
});

test("1x3 vertical connect", () => {
  const columns = ["1fr"];
  const rows = ["1fr", "1fr", "1fr"];
  const areas = [["a"], ["b"], ["b"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [["a"], ["h-0-0"], ["b"], ["b"], ["b"]]);
});

test("2x2 crossed connect", () => {
  const columns = ["1fr", "1fr"];
  const rows = ["1fr", "1fr"];
  const areas = [["a", "a"], ["a", "a"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [
    ["a", "a", "a"],
    ["a", "a", "a"],
    ["a", "a", "a"]
  ]);
});

test("3x2 crossed connect", () => {
  const columns = ["1fr", "1fr"];
  const rows = ["1fr", "1fr"];
  const areas = [["a", "b", "b"], ["a", "b", "b"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [
    ["a", "v-0-0", "b", "b", "b"],
    ["a", "c-0-0", "b", "b", "b"],
    ["a", "v-1-0", "b", "b", "b"]
  ]);
});

test("2x3 crossed connect", () => {
  const columns = ["1fr", "1fr"];
  const rows = ["1fr", "1fr"];
  const areas = [["a", "a"], ["b", "b"], ["b", "b"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [
    ["a", "a", "a"],
    ["h-0-0", "c-0-0", "h-0-1"],
    ["b", "b", "b"],
    ["b", "b", "b"],
    ["b", "b", "b"]
  ]);
});

test("2x2 not crossed connect", () => {
  const columns = ["1fr", "1fr"];
  const rows = ["1fr", "1fr"];
  const areas = [["a", "a"], ["a", "b"]];
  const built = buildEditableGridData({ rows, columns, areas }, 16);

  assert.deepEqual(built.areas, [
    ["a", "a", "a"],
    ["a", "c-0-0", "h-0-1"],
    ["a", "v-1-0", "b"]
  ]);
});
