class Vec {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  isVec2(v: Vec): v is Vec2 {
    return v.type === "vec2";
  }
  isVec3(v: Vec): v is Vec3 {
    return v.type === "vec3";
  }
  isVec4(v: Vec): v is Vec4 {
    return v.type === "vec4";
  }

  sub(v: Vec2): Vec2;
  sub(v: Vec3): Vec3;
  sub(v: Vec2 | Vec3) {
    if (this.isVec2(v) && this.isVec2(this)) {
      return new Vec2(this.x - v.x, this.y - v.y);
    }
    if (this.isVec3(v) && this.isVec3(this)) {
      return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
  }

  dot(v: Vec3) {
    if (this.isVec3(this)) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    throw "dot() this is not Vec3"
  }

  negate() {
    if (this.isVec2(this)) {
      this.x = -this.x;
      this.y = -this.y;
    } else if (this.isVec3(this) || this.isVec4(this)) {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
    }
  }

  cross(v: Vec3) {
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
    if (this.isVec2(this)) {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    } else {
      const v = this as unknown as Vec3;
      return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
  }

  normalize() {
    const len = this.length();
    if (this.isVec2(this)) {
      this.x /= len;
      this.y /= len;
    } else {
      const v = this as unknown as Vec3;
      v.x /= len;
      v.y /= len;
      v.z /= len;
    }
  }
}

class Vec2 extends Vec {
  x: number;
  y: number;
  constructor(x: number, y: number, type = "vec2") {
    super(type);
    this.x = x;
    this.y = y;
  }
}

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
