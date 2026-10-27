// Builds one two-slide deck per Keynote transition effect, so exports can be
// diffed against the "no transition effect" baseline.
//
//   osascript -l JavaScript scripts/make-transition-fixtures.js <out-dir> [effect ...]
//
// Saves .key today. Once Keynote's scripting dictionary gains a .keyx export
// format, set KEYX_FORMAT below and each deck is exported alongside.

const KEYX_FORMAT = null; // e.g. "Keynote Interchange Format" once it ships

const ALL_EFFECTS = [
  "no transition effect", "magic move", "shimmer", "sparkle", "swing",
  "object cube", "object flip", "object pop", "object push", "object revolve",
  "object zoom", "perspective", "clothesline", "confetti", "dissolve", "drop",
  "droplet", "fade through color", "grid", "iris", "move in", "push", "reveal",
  "switch", "wipe", "blinds", "color planes", "cube", "doorway", "fall", "flip",
  "flop", "mosaic", "page flip", "pivot", "reflection", "revolving door",
  "scale", "swap", "swoosh", "twirl", "twist", "fade and move", "radial wipe",
];

function run(argv) {
  const outDir = argv[0];
  if (!outDir) throw new Error("usage: make-transition-fixtures.js <out-dir> [effect ...]");
  const effects = argv.length > 1 ? argv.slice(1) : ALL_EFFECTS;

  const app = Application("com.apple.Keynote");
  const se = Application.currentApplication();
  se.includeStandardAdditions = true;
  se.doShellScript(`mkdir -p ${quoted(outDir)}`);

  for (const effect of effects) {
    const doc = app.Document().make();
    const first = doc.slides[0];

    // Same shape on both slides, moved and resized, so Magic Move and the
    // object-* transitions have something to animate.
    addShape(app, first, { x: 200, y: 300 }, 300);
    doc.slides.push(app.Slide({ baseSlide: first.baseSlide }));
    const second = doc.slides[1];
    addShape(app, second, { x: 1200, y: 500 }, 500);

    first.transitionProperties = {
      transitionEffect: effect,
      transitionDuration: 1.0,
      transitionDelay: 0,
      automaticTransition: false,
    };

    const base = `${outDir}/${slug(effect)}`;
    app.save(doc, { in: Path(`${base}.key`) });
    if (KEYX_FORMAT) app.export(doc, { to: Path(`${base}.keyx`), as: KEYX_FORMAT });
    app.close(doc, { saving: "no" });
  }
  return `wrote ${effects.length} decks to ${outDir}`;
}

function addShape(app, slide, position, size) {
  slide.shapes.push(app.Shape({ position, width: size, height: size }));
}

function slug(effect) {
  return effect.replace(/\s+/g, "-");
}

function quoted(path) {
  return `'${path.replace(/'/g, `'\\''`)}'`;
}
