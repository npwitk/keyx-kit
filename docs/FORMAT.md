# .keyx format notes

Working notes from the fixture study. Nothing here is from Apple documentation
unless linked. Record the Keynote version for every finding: the format may
change between releases.

## Known (from Apple's Oct 27, 2026 announcement)
- "Keynote Interchange Format (.keyx), an open JSON-based bundle file format
  designed to be readable and accessible to external tools, developer
  workflows, and AI agents."
- Ships with the Keynote update in November 2026.

## Open questions
- Directory package or zip? (`loadBundle` only handles directories for now)
- One JSON file per slide, or one document file?
- Are themes and master slides embedded, or referenced by name?
- Coordinates: points? Origin top-left? Relative to slide size?
- Are object identities stable across exports (needed for Magic Move pairing
  and for clean diffs)?
- Does the format carry everything `.key` does, or is it lossy (e.g. builds,
  chart styling, audio)?
- Is there a published schema or version field?

## Findings
_None yet. Add one section per topic (Transitions, Builds, Text, ...) with the
fixture name, the diff output and the conclusion._
