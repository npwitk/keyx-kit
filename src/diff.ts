import type { Bundle } from "./bundle.ts";

export type Change =
  | { kind: "added"; path: string; after: unknown }
  | { kind: "removed"; path: string; before: unknown }
  | { kind: "changed"; path: string; before: unknown; after: unknown };

export interface DiffOptions {
  // Keys whose values differ between otherwise identical exports (ids,
  // timestamps). Matching keys are skipped entirely.
  ignoreKeys?: RegExp;
}

// Guess at volatile keys; tune once we see real exports.
export const DEFAULT_IGNORE = /^(id|uuid|.*(Id|ID|UUID|Identifier)|created|modified|.*Date|timestamp)$/;

// The core tool of the format study: export two decks that differ by one
// setting (e.g. a transition), diff them, and what's left is how that
// setting is encoded.
export function diffBundles(a: Bundle, b: Bundle, options: DiffOptions = {}): Change[] {
  const ignore = options.ignoreKeys ?? DEFAULT_IGNORE;
  const changes: Change[] = [];

  for (const file of union(a.json.keys(), b.json.keys())) {
    diffValue(a.json.get(file), b.json.get(file), file, ignore, changes);
  }
  for (const file of union(a.assets.keys(), b.assets.keys())) {
    diffValue(a.assets.get(file), b.assets.get(file), file, ignore, changes);
  }
  return changes;
}

export function diffJSON(a: unknown, b: unknown, options: DiffOptions = {}): Change[] {
  const changes: Change[] = [];
  diffValue(a, b, "$", options.ignoreKeys ?? DEFAULT_IGNORE, changes);
  return changes;
}

function diffValue(a: unknown, b: unknown, path: string, ignore: RegExp, out: Change[]): void {
  if (a === undefined && b === undefined) return;
  if (a === undefined) return void out.push({ kind: "added", path, after: b });
  if (b === undefined) return void out.push({ kind: "removed", path, before: a });

  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      diffValue(a[i], b[i], `${path}[${i}]`, ignore, out);
    }
    return;
  }

  if (isObject(a) && isObject(b)) {
    for (const key of union(Object.keys(a), Object.keys(b))) {
      if (ignore.test(key)) continue;
      diffValue(a[key], b[key], `${path}.${key}`, ignore, out);
    }
    return;
  }

  if (a !== b) out.push({ kind: "changed", path, before: a, after: b });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function union<T>(a: Iterable<T>, b: Iterable<T>): T[] {
  return [...new Set([...a, ...b])].sort();
}
