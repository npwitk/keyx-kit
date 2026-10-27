#!/usr/bin/env -S node --experimental-strip-types --no-warnings
import { loadBundle } from "./bundle.ts";
import { DEFAULT_IGNORE, diffBundles, type Change } from "./diff.ts";

const usage = `usage:
  keyx diff <a.keyx> <b.keyx> [--keep-ids] [--json]
  keyx ls <deck.keyx>`;

const [command, ...args] = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const paths = args.filter((a) => !a.startsWith("--"));

switch (command) {
  case "diff": {
    if (paths.length !== 2) fail(usage);
    const [a, b] = await Promise.all(paths.map(loadBundle));
    const changes = diffBundles(a, b, {
      ignoreKeys: flags.has("--keep-ids") ? /^$/ : DEFAULT_IGNORE,
    });
    if (flags.has("--json")) console.log(JSON.stringify(changes, null, 2));
    else for (const change of changes) console.log(format(change));
    process.exitCode = changes.length ? 1 : 0;
    break;
  }
  case "ls": {
    if (paths.length !== 1) fail(usage);
    const bundle = await loadBundle(paths[0]);
    for (const file of bundle.json.keys()) console.log(`json   ${file}`);
    for (const [file, size] of bundle.assets) console.log(`asset  ${file} (${size} bytes)`);
    break;
  }
  default:
    fail(usage);
}

function format(change: Change): string {
  const show = (v: unknown) => JSON.stringify(v);
  switch (change.kind) {
    case "added": return `+ ${change.path} = ${show(change.after)}`;
    case "removed": return `- ${change.path} = ${show(change.before)}`;
    case "changed": return `~ ${change.path}: ${show(change.before)} -> ${show(change.after)}`;
  }
}

function fail(message: string): never {
  console.error(message);
  process.exit(2);
}
