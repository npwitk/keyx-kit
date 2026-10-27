import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

// A .keyx bundle as loaded from disk: every JSON file parsed, everything else
// (images, movies, fonts) recorded by path and size only.
export interface Bundle {
  root: string;
  json: Map<string, unknown>;
  assets: Map<string, number>;
}

// Apple describes .keyx as a "JSON-based bundle". Until the format ships we
// don't know whether it is a directory package or a zip, so only directories
// are handled here; zip support lands once we have a real file.
export async function loadBundle(root: string): Promise<Bundle> {
  const info = await stat(root);
  if (!info.isDirectory()) {
    throw new Error(`${root} is not a directory (zipped bundles are not supported yet)`);
  }

  const bundle: Bundle = { root, json: new Map(), assets: new Map() };
  for (const file of await walk(root)) {
    const key = relative(root, file).split(sep).join("/");
    if (key.endsWith(".json")) {
      bundle.json.set(key, JSON.parse(await readFile(file, "utf8")));
    } else {
      bundle.assets.set(key, (await stat(file)).size);
    }
  }
  return bundle;
}

async function walk(dir: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files.sort();
}
