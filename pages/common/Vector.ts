class Vec {
  type: string;
  x: number;
  y: number;
  constructor(x: number, y: number, type: string) {
    this.type = type;
    this.x = x;
    this.y = y;
  }

  isVec3(v: Vec): v is Vec3 {
    return v.type === "vec3";
  }
  isVec4(v: Vec): v is Vec4 {
    return v.type === "vec4";
  }

  sub(v: Vec): this {
    this.x -= v.x;
    this.y -= v.y;
    if (this.isVec3(v) && this.isVec3(this)) {
      if (this.z !== 0) {
        this.z -= v.z;
      }
    }
    return this;
  }

  dot(v: Vec3): number {
    if (this.isVec3(this)) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    throw "dot(): this is not Vec3";
  }

  negate(): this {
    this.x = -this.x;
    this.y = -this.y;
    if (this.isVec3(this) || this.isVec4(this)) {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
    }
    return this;
  }

  cross(v: Vec3): Vec3 {
    if (this.isVec3(this)) {
      return new Vec3(
        this.y * v.z - this.z * v.y,
        this.z * v.x - this.x * v.z,
        this.x * v.y - this.y * v.x
      );
    }
    throw new Error("Cannot cross product a Vec2");
  }

  length() {
    if (this.isVec3(this)) {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    } else {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  }

  normalize(): this {
    const len = this.length();
    this.x /= len;
    this.y /= len;
    if (this.isVec3(this)) {
      this.z /= len;
    } 
    return this;
  }
}

const Vec2 = Vec;

class Vec3 extends Vec2 {
  z: number;
  constructor(x: number, y: number, z: number, type = "vec3") {
    super(x, y, type);
    this.z = z;
  }
}

class Vec4 extends Vec3 {
  w: number;
  constructor(x: number, y: number, z: number, w: number) {
    super(x, y, z, "vec4");
    this.w = w;
  }
}

export { Vec2, Vec3, Vec4 };
