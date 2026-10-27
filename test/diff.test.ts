import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadBundle } from "../src/bundle.ts";
import { diffBundles, diffJSON } from "../src/diff.ts";

test("reports only the setting that differs", () => {
  const a = { slides: [{ id: "A1", transition: { effect: "dissolve", duration: 1 } }] };
  const b = { slides: [{ id: "B7", transition: { effect: "magic-move", duration: 1 } }] };
  assert.deepEqual(diffJSON(a, b), [
    { kind: "changed", path: "$.slides[0].transition.effect", before: "dissolve", after: "magic-move" },
  ]);
});

test("reports added and removed keys and array items", () => {
  const changes = diffJSON({ builds: [1], notes: "hi" }, { builds: [1, 2], delay: 0.5 });
  assert.deepEqual(changes, [
    { kind: "added", path: "$.builds[1]", after: 2 },
    { kind: "added", path: "$.delay", after: 0.5 },
    { kind: "removed", path: "$.notes", before: "hi" },
  ]);
});

test("loads a directory bundle and diffs across files", async () => {
  const root = await mkdtemp(join(tmpdir(), "keyx-"));
  const make = async (name: string, effect: string, image: string) => {
    const dir = join(root, name);
    await mkdir(join(dir, "slides"), { recursive: true });
    await writeFile(join(dir, "slides", "1.json"), JSON.stringify({ transition: effect }));
    await writeFile(join(dir, "image.png"), image);
    return loadBundle(dir);
  };
  const a = await make("a.keyx", "dissolve", "xx");
  const b = await make("b.keyx", "push", "xxxx");

  assert.deepEqual([...a.json.keys()], ["slides/1.json"]);
  assert.deepEqual(diffBundles(a, b), [
    { kind: "changed", path: "slides/1.json.transition", before: "dissolve", after: "push" },
    { kind: "changed", path: "image.png", before: 2, after: 4 },
  ]);
});
