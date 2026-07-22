export type StarShape = "dot" | "diamond" | "star4" | "sparkle";

export type HeroStar = {
  id: number;
  left: number;
  top: number;
  size: number;
  peak: number;
  duration: number;
  delay: number;
  shape: StarShape;
};

// Deterministic PRNG (mulberry32) — same layout every build, no client JS needed to place stars.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Jittered grid keeps spacing even (no clumping, no huge gaps) while the per-cell
// random offset stops it from reading as a mechanical grid. Density drops sharply
// across the headline/CTA column and near the eclipse mark so stars stay ambient,
// not distracting. Shapes are mixed (dot/diamond/star4/sparkle) so the field
// doesn't read as one repeated icon.
export function generateHeroStars(seed = 1337): HeroStar[] {
  const rand = mulberry32(seed);
  const cols = 10;
  const rows = 7;
  const stars: HeroStar[] = [];
  let id = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellW = 100 / cols;
      const cellH = 100 / rows;
      const baseX = col * cellW + cellW / 2;
      const baseY = row * cellH + cellH / 2;
      const jitterX = (rand() - 0.5) * cellW * 0.85;
      const jitterY = (rand() - 0.5) * cellH * 0.85;
      const x = Math.min(98, Math.max(2, baseX + jitterX));
      const y = Math.min(98, Math.max(2, baseY + jitterY));

      const inContentColumn = x > 25 && x < 75 && y > 8 && y < 78;
      const nearMark = x > 38 && x < 62 && y > 76;

      const keepChance = nearMark ? 0.06 : inContentColumn ? 0.1 : 0.5;
      if (rand() > keepChance) continue;

      // Content-column stars stay plain, small dots — everywhere else gets the
      // full shape mix so the field reads as varied, not one icon repeated.
      let shape: StarShape = "dot";
      if (!inContentColumn) {
        const roll = rand();
        shape = roll < 0.48 ? "dot" : roll < 0.7 ? "sparkle" : roll < 0.87 ? "diamond" : "star4";
      }
      const accent = shape !== "dot";

      stars.push({
        id: id++,
        left: x,
        top: y,
        size:
          shape === "sparkle"
            ? 1.6 + rand() * 1.4
            : shape === "star4"
              ? 2 + rand() * 1.8
              : shape === "diamond"
                ? 1.8 + rand() * 1.6
                : 1.3 + rand() * 1.5,
        peak: accent ? 0.75 + rand() * 0.25 : 0.5 + rand() * 0.35,
        duration: 2.4 + rand() * 3.4,
        delay: rand() * 5,
        shape,
      });
    }
  }

  return stars;
}
