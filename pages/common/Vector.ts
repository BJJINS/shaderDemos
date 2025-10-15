class Vec2 {
  x: number;
  y: number;
  type: "vec2";
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.type = "vec2";
  }
}

class Vec3 {
  x: number;
  y: number;
  z: number;
  type: "vec3";
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = "vec3";
  }
}

class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
  type: "vec4";
  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.type = "vec4";
  }
}

function dot(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function negate(v: Vec2 | Vec3) {
  if (v.type === "vec2") {
    return new Vec2(-v.x, -v.y);
  }
  return new Vec3(-v.x, -v.y, -v.z);
}

function cross(a: Vec3, b: Vec3) {
  return new Vec3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

export { Vec2, Vec3, Vec4, dot, cross, negate};
