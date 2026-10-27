---
name: apple-keynote-style
description: Design and animate presentations in the style of Apple's event keynotes - one idea per slide, large type, restrained color, and motion that explains (Magic Move, simple builds). Use when the user asks for a Keynote deck, a launch-style or "Apple-style" presentation, wants a deck to feel more polished or cinematic, or asks how to animate slides. Works through Keynote's built-in MCP on macOS 27, or by writing .keyx with keyx-kit anywhere else.
---

# Apple-style Keynote decks

DRAFT. Patterns are drawn from watching Apple's public event keynotes. Refine
them against the sample list at the bottom before treating any rule as settled.

## Principles
1. **One idea per slide.** If a slide needs a title *and* a paragraph, it is two slides.
2. **The speaker carries the words; the slide carries the moment.** Slides show a
   number, a product, a short phrase or one image. Never the script.
3. **Big type, few words.** Headline type fills the slide width. Fewer than ~8 words.
4. **Restraint in color.** Black or white background, one accent color at most,
   usually taken from the product or image.
5. **Motion explains, never decorates.** Every animation answers "what changed?"

## Slide recipes
- **The number.** A single huge figure ("2x", "18 hours"), a short label below in
  secondary color. Build the label in after the number.
- **The reveal.** Product image alone on a dark background; the name appears
  after a beat.
- **The comparison.** Two values side by side, the old one dimmed. Magic Move from
  the single-value slide so the old number slides aside.
- **The list that isn't a list.** Instead of bullets, one item per slide with Magic
  Move keeping the shared heading in place.
- **The quote.** One sentence, attribution small and secondary.
- **Chapter card.** One word, centered, before each section.

## Animation recipes
- **Default transition:** Dissolve (about 0.5-1.0 s) or Magic Move. Avoid cube,
  confetti, page flip and other effects that call attention to themselves.
- **Magic Move** whenever the same object appears on consecutive slides at a
  different size or position: zooming into a detail, moving a title to a corner,
  rearranging a diagram. Duplicate the slide, then change the copy, so the
  objects pair.
- **Builds:** Dissolve or Move In, short and quick. Build text by line, not by
  character. Use "after previous" with a small delay to chain a sequence the
  speaker doesn't have to click through.
- **Pace:** at most one click per idea. If a slide needs more than 3-4 builds,
  split it.

## Workflow
1. Write the talk as a list of single sentences; each sentence is a candidate slide.
2. Assign each a recipe from above.
3. Choose the connecting motion between slides: Magic Move if objects carry over,
   otherwise Dissolve.
4. Put the full script in presenter notes.
5. Review: read slides alone with no notes; if they read as a document, cut words.

## Tools
- **macOS 27 with Keynote's MCP enabled:** use its tools to create slides, set
  transitions and builds directly.
- **Elsewhere:** generate a `.keyx` bundle with keyx-kit (not yet available: the
  library waits on the format shipping in November 2026).

## Sample list for refinement (to watch, not to copy)
WWDC 2023-2026 keynotes; iPhone events (Sep 2023-2025); Mac events (Oct 2023,
Nov 2024); iPad (May 2024). For each, note: words per slide, how often Magic
Move appears, which builds are used, and how the reveal moments are paced.
