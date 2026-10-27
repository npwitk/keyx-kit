# keyx-kit

Read, write and diff Keynote decks in Apple's **Keynote Interchange Format
(.keyx)** without Keynote, on any OS. Like python-pptx, but for Keynote.

> **Status: pre-release.** Apple announced .keyx on Oct 27, 2026; it ships with
> Keynote in November. Until then this repo holds the tools for studying the
> format, not a parser for it.

## Why
Keynote files have been readable only on Apple devices. An open format makes it
possible to:

- open, preview and convert decks on Windows, Linux and Chromebooks
- generate decks from data or Markdown on servers and in CI
- let any AI agent, in any language, write Keynote decks (Apple's built-in
  assistant needs macOS 27 and U.S. English)
- check decks for accessibility: alt text, contrast, reading order
- keep decks in git and diff them like code

## What's here
| Path | Purpose |
|---|---|
| `src/diff.ts`, `src/cli.ts` | `keyx diff a.keyx b.keyx`: structural diff of two bundles, ignoring volatile ids |
| `scripts/make-transition-fixtures.js` | Builds one test deck per Keynote transition (44) via JXA |
| `fixtures/CATALOG.md` | Every fixture deck needed to map the format |
| `docs/FORMAT.md` | Format notes and open questions |
| `skills/apple-keynote-style/` | Draft agent skill for Apple-style decks and animation |

## Method
Make two decks that differ in exactly one setting, export both, diff them. What
remains is how that setting is encoded. Each pair becomes a test.

```sh
npm install
npm test
npm run fixtures:transitions          # macOS with Keynote; writes fixtures/out/
npm run keyx -- diff a.keyx b.keyx
```

## Roadmap
1. Format study with fixtures, JSON Schema, and notes in `docs/FORMAT.md`
2. Library: parse into a typed model, write, validate, round-trip tests
3. Markdown to `.keyx` CLI, HTML previewer, accessibility linter
4. Apple-style deck skill on top

Not affiliated with Apple. Keynote is a trademark of Apple Inc.

## License
MIT
