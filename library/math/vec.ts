export interface Vec3 {
  x: number;
  y: number;
  z: number;
  type: "vec3";
}

export const vec3 = (x = 0, y = 0, z = 0): Vec3 => {
  return {
    x,
    y,
    z,
    type: "vec3",
  };
};

export interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
  type: "vec4";
}

export const vec4 = (x = 0, y = 0, z = 0, w = 1): Vec4 => {
  return {
    ...vec3(x, y, z),
    w,
    type: "vec4",
  };
};

const scale = (v: Vec3 | Vec4, x: number, y?: number, z?: number) => {
  v.x *= x;
  v.y *= y || x;
  v.z *= z || x;
  return v;
};

const length = (v: Vec3 | Vec4) => {
  return Math.hypot(v.x, v.y, v.z);
};

const sub = (v1: Vec3, v2: Vec3) => {
  v1.x -= v2.x;
  v1.y -= v2.y;
  v1.z -= v2.z;
  return v1;
};

const normalize = (v: Vec3) => {
  const len = length(v);
  if (!len) return v;
  if (len > 1e-8) {
    v.x /= len;
    v.y /= len;
    v.z /= len;
  } else {
    v.x = 0;
    v.y = 0;
    v.z = 0;
  }
  return v;
};

const add = (v1: Vec3, v2: Vec3) => {
  v1.x += v2.x;
  v1.y += v2.y;
  v1.z += v2.z;
  return v1;
};

const isVec4 = (v: Vec3 | Vec4): v is Vec4 => {
  return v.type === "vec4";
};

function clone(v: Vec3): Vec3;
function clone(v: Vec4): Vec4;
function clone(v: Vec3 | Vec4): Vec3 | Vec4;
function clone(v: Vec3 | Vec4) {
  if (isVec4(v)) {
    return vec4(v.x, v.y, v.z, v.w);
  }
  return vec3(v.x, v.y, v.z);
}

const negate = (v: Vec3) => {
  v.x = -v.x;
  v.y = -v.y;
  v.z = -v.z;
  return v;
};

const dot = (v1: Vec3, v2: Vec3) => {
  return  v1.x * v2.x + v1.y * v2.y +v1.z * v2.z
};

const cross = (v1: Vec3, v2: Vec3) => {
  v1.x = v1.y * v2.z - v1.z * v2.y;
  v1.y = v1.z * v2.x - v1.x * v2.z;
  v1.z = v1.x * v2.y - v1.y * v2.x;
  return vec3(v1.x, v1.y, v1.z);
};

const toArray = (v: Vec3 | Vec4) => {
  if (isVec4(v)) {
    return [v.x, v.y, v.z, v.w];
  }
  return [v.x, v.y, v.z];
};

export const Vec = {
  scale,
  length,
  sub,
  normalize,
  add,
  clone,
  negate,
  dot,
  cross,
  toArray,
};
