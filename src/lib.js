// Small helpers shared by components.

// Turns a template-literal message into paragraphs.
// Blank lines split paragraphs; single line breaks are kept inside a paragraph.
export function toParagraphs(text = "") {
  return text
    .replace(/\r/g, "")
    .trim()
    .split(/\n\s*\n/)
    .map((p) =>
      p
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
    )
    .filter(Boolean);
}

// Resolves "photos/x.jpg" relative to wherever the site is hosted.
export function assetUrl(path = "") {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return import.meta.env.BASE_URL + path.replace(/^\.?\//, "");
}

// Deterministic pseudo-random, so the sky looks the same on every visit.
export function seeded(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const EASE = [0.22, 0.61, 0.36, 1];
