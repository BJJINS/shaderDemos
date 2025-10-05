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

export {
    Vec2,
    Vec3,
    Vec4,
}
