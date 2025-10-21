import { Mat4 } from "@core/math/Matrix";
import { degreesToRadians } from "@core/gl/utils";
import { type Vec3 } from "@core/math/Vector";

class Quaternion {
  x = 0;
  y = 0;
  z = 0;
  w = 1; // w是1表示旋转角度是0度
  constructor() {}
  set(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  copy(quaternion: Quaternion) {
    const { x, y, z, w } = quaternion;
    return this.set(x, y, z, w);
  }
  length() {
    const { x, y, z, w } = this;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  normalize() {
    const len = this.length();
    if (!len) {
      return this;
    }
    const { x, y, z, w } = this;
    return this.set(x / len, y / len, z / len, w / len);
  }
  // 绕axis向量逆时针旋转degrees度
  setAxisDegrees(axis: Vec3, degrees: number) {
    const halfRadians = degreesToRadians(degrees / 2);
    const c = Math.cos(halfRadians);
    const s = Math.sin(halfRadians);
    return this.set(s * axis.x, s * axis.y, s * axis.z, c).normalize();
  }
  toMatrix() {
    const { x, y, z, w } = this;
    return new Mat4([
      1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w, 0,
      2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
      2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y, 0,
      0, 0, 0, 1
    ]);
  }
}

export default Quaternion;
