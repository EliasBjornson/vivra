// Bundgaard et al., NEJM 2026, DOI 10.1056/NEJMoa2609059.
// Supplementary Table S7, printed pp. 40–42 (PDF pp. 41–43).
// Counts, not rounded published percentages. CAC and CTA have different denominators.
export type Sex = 'women' | 'men';
export const ageGroups = ['18–29', '30–39', '40–49', '50–59', '60–70'];
export const reactData = {
  men: [
    { n: 841, zero: 835, mild: 5, moderate: 1, high: 0, ctaN: 757, cta: 11 },
    { n: 1596, zero: 1515, mild: 74, moderate: 7, high: 0, ctaN: 1607, cta: 146 },
    { n: 1969, zero: 1521, mild: 379, moderate: 55, high: 14, ctaN: 1756, cta: 544 },
    { n: 2074, zero: 1144, mild: 633, moderate: 168, high: 129, ctaN: 1937, cta: 1074 },
    { n: 1013, zero: 274, mild: 360, moderate: 163, high: 216, ctaN: 958, cta: 758 },
  ],
  women: [
    { n: 1078, zero: 1075, mild: 3, moderate: 0, high: 0, ctaN: 883, cta: 7 },
    { n: 1709, zero: 1686, mild: 21, moderate: 2, high: 0, ctaN: 1541, cta: 40 },
    { n: 2000, zero: 1879, mild: 108, moderate: 11, high: 2, ctaN: 1719, cta: 170 },
    { n: 2197, zero: 1779, mild: 335, moderate: 59, high: 24, ctaN: 1960, cta: 510 },
    { n: 1137, zero: 639, mild: 330, moderate: 115, high: 53, ctaN: 1022, cta: 492 },
  ],
};
export function ageIndex(age: number) { return age < 30 ? 0 : age < 40 ? 1 : age < 50 ? 2 : age < 60 ? 3 : 4; }
export const pct = (n: number, total: number) => 100 * n / total;
export const percent = (value: number) => value.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
export function wilson(k: number, n: number) {
  const p = k / n, z = 1.95996398454, a = 1 + z*z/n;
  const c = (p + z*z/(2*n))/a, e = z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/a;
  return `${percent(100*Math.max(0,c-e))}–${percent(100*Math.min(1,c+e))}`;
}

// A single logistic S-curve per sex and outcome, fitted to grouped counts.
// Binomial maximum likelihood uses denominators as weights; group midpoint ages
// approximate each group's age distribution. Extrapolation retains the same curve.
export const ageAnchors = [23.5, 34.5, 44.5, 54.5, 65];
function makeCurve(counts: number[], totals: number[]) {
  const x = ageAnchors.map(age => (age - 45) / 10);
  let intercept = -3, slope = 1;
  for (let iteration = 0; iteration < 50; iteration++) {
    let g0 = 0, g1 = 0, h00 = 0, h01 = 0, h11 = 0;
    for (let i = 0; i < x.length; i++) {
      const p = 1 / (1 + Math.exp(-(intercept + slope * x[i])));
      const residual = counts[i] - totals[i] * p;
      const weight = totals[i] * p * (1 - p);
      g0 += residual; g1 += residual * x[i];
      h00 += weight; h01 += weight * x[i]; h11 += weight * x[i] * x[i];
    }
    const determinant = h00 * h11 - h01 * h01;
    const d0 = (h11 * g0 - h01 * g1) / determinant;
    const d1 = (h00 * g1 - h01 * g0) / determinant;
    intercept += d0; slope += d1;
    if (Math.max(Math.abs(d0), Math.abs(d1)) < 1e-10) break;
  }
  return (age: number) => 100 / (1 + Math.exp(-(intercept + slope * (age - 45) / 10)));
}
const curves = Object.fromEntries((['men', 'women'] as Sex[]).map(sex => {
  const rows = reactData[sex], totals = rows.map(d => d.n);
  return [sex, {
    any: makeCurve(rows.map(d => d.n - d.zero), totals),
    moderate: makeCurve(rows.map(d => d.moderate + d.high), totals),
  }];
})) as Record<Sex, { any: (age: number) => number; moderate: (age: number) => number }>;
export function estimate(sex: Sex, age: number) {
  if (!Number.isFinite(age) || age < 18 || age > 80) return null;
  return { any: curves[sex].any(age), moderate: curves[sex].moderate(age) };
}
export function approximate(value: number) {
  if (value < 1) return '<1 %';
  if (value > 99) return '>99 %';
  return Math.round(value).toLocaleString('sv-SE') + ' %';
}
