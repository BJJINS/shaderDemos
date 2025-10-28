abstract class Vec {
  type: string;
  x: number;
  y: number;
  z: number;
  constructor(type: string, x?: number, y?: number, z?: number) {
    this.type = type;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  length(): number {
    return Math.hypot(this.x, this.y, this.z);
  }

  scale(x: number): this;
  scale(x: number, y: number, z: number): this;
  scale(x: number, y?: number, z?: number): this {
    y = y ?? x;
    z = z ?? x;
    this.x *= x;
    this.y *= y;
    this.z *= z;
    return this;
  }

  sub(v: Vec): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  add(v: Vec): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  dot(v: Vec): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  negate(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  normalize(): this {
    let len = this.length();
    if (!len) {
      return this;
    }
    if (len > 1e-8) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }

    return this;
  }
}

class Vec3 extends Vec {
  constructor(x?: number, y?: number, z?: number) {
    super("vec3", x, y, z);
  }
  cross(v: Vec3) {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  clone() {
    return new Vec3(this.x, this.y, this.z);
  }
}

class Vec4 extends Vec {
  w = 1;
  constructor(x?: number, y?: number, z?: number, w?: number) {
    super("vec4", x, y, z);
    this.w = w || this.w;
  }
  clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
}

export { Vec3, Vec4 };
