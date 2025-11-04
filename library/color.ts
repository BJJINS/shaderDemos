import { Vec3, vec3 } from "./math/vec";

export const SRGBColorSpace = "SRGBColorSpace" as const;
export const LinearSRGBColorSpace = "LinearSRGBColorSpace" as const;
export type ColorSpace = typeof SRGBColorSpace | typeof LinearSRGBColorSpace;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const srgbToLinearComponent = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

export const linearToSrgbComponent = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const parseHex = (hex: string | number): [number, number, number] => {
  let h: number;
  if (typeof hex === "number") {
    h = hex >>> 0;
  } else {
    let s = hex.trim();
    if (s.startsWith("#")) s = s.slice(1);
    if (s.length === 3) s = s.split("").map((ch) => ch + ch).join("");
    h = parseInt(s, 16) >>> 0;
  }
  const r = ((h >> 16) & 255) / 255;
  const g = ((h >> 8) & 255) / 255;
  const b = (h & 255) / 255;
  return [r, g, b];
};

export function color(hex: string | number, space?: ColorSpace): Vec3;
export function color(r: number, g: number, b: number, space?: ColorSpace): Vec3;
export function color(a: string | number, b?: number | ColorSpace, c?: number, d?: ColorSpace): Vec3 {
  if (typeof a === "string" || (typeof a === "number" && (typeof b !== "number" || b === undefined))) {
    const space = (typeof b === "string" ? b : SRGBColorSpace) as ColorSpace;
    const [sr, sg, sb] = parseHex(a);
    if (space === SRGBColorSpace) {
      return vec3(
        clamp01(srgbToLinearComponent(sr)),
        clamp01(srgbToLinearComponent(sg)),
        clamp01(srgbToLinearComponent(sb))
      );
    }
    return vec3(clamp01(sr), clamp01(sg), clamp01(sb));
  }
  const r = typeof a === "number" ? a : 0;
  const g = typeof b === "number" ? b : 0;
  const bl = typeof c === "number" ? c : 0;
  const space = (d || LinearSRGBColorSpace) as ColorSpace;
  if (space === SRGBColorSpace) {
    return vec3(
      clamp01(srgbToLinearComponent(r)),
      clamp01(srgbToLinearComponent(g)),
      clamp01(srgbToLinearComponent(bl))
    );
  }
  return vec3(clamp01(r), clamp01(g), clamp01(bl));
}
