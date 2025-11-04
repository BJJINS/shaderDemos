import { mat4x4 } from "./matrix";
import { Vec, Vec3 } from "./vec";

export const translateM = (x = 0, y = 0, z = 0) => {
  return mat4x4([
    1, 0, 0, x, 
    0, 1, 0, y, 
    0, 0, 1, z, 
    0, 0, 0, 1
  ]);
};

export const scaleM = (x = 1, y = 1, z = 1) => {
  return mat4x4([
    x, 0, 0, 0, 
    0, y, 0, 0, 
    0, 0, z, 0, 
    0, 0, 0, 1
  ]);
};

export const rotationXM = (radians: number) => {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return mat4x4([
    1, 0, 0, 0, 
    0, c, -s, 0, 
    0, s, c, 0, 
    0, 0, 0, 1
  ]);
};

export const rotationYM = (radians: number) => {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return mat4x4([
    c, 0, s, 0, 
    0, 1, 0, 0, 
    -s, 0, c, 0, 
    0, 0, 0, 1
  ]);
};

export const rotationZM = (radians: number) => {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  return mat4x4([
    c, -s, 0, 0, 
    s, c, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 0, 1
  ]);
};

export const quaternionM = (axis: Vec3, radians: number) => {
  const halfRadians = radians * 0.5;
  const c = Math.cos(halfRadians);
  const s = Math.sin(halfRadians);
  const { x, y, z } = Vec.scale(Vec.normalize(axis), s);
  const w = c;
  return mat4x4([
      1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w, 0,
      2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
      2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y, 0,
      0, 0, 0, 1
  ]);
};
