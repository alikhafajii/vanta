export type HeroStar = {
  id: number;
  left: number;
  top: number;
  size: number;
  peak: number;
  duration: number;
  delay: number;
  cross: boolean;
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
// not distracting.
export function generateHeroStars(seed = 1337): HeroStar[] {
  const rand = mulberry32(seed);
  const cols = 7;
  const rows = 5;
  const stars: HeroStar[] = [];
  let id = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellW = 100 / cols;
      const cellH = 100 / rows;
      const baseX = col * cellW + cellW / 2;
      const baseY = row * cellH + cellH / 2;
      const jitterX = (rand() - 0.5) * cellW * 0.8;
      const jitterY = (rand() - 0.5) * cellH * 0.8;
      const x = Math.min(98, Math.max(2, baseX + jitterX));
      const y = Math.min(98, Math.max(2, baseY + jitterY));

      const inContentColumn = x > 25 && x < 75 && y > 8 && y < 78;
      const nearMark = x > 38 && x < 62 && y > 76;

      const keepChance = nearMark ? 0.12 : inContentColumn ? 0.22 : 0.85;
      if (rand() > keepChance) continue;

      const cross = !inContentColumn && rand() < 0.16;

      stars.push({
        id: id++,
        left: x,
        top: y,
        size: cross ? 3 + rand() * 1.6 : 1.5 + rand() * 1.7,
        peak: cross ? 0.75 + rand() * 0.25 : 0.4 + rand() * 0.45,
        duration: 2.6 + rand() * 3.2,
        delay: rand() * 5,
        cross,
      });
    }
  }

  return stars;
}
