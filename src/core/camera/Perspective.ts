import Camera from "@core/camera/Camera";
import global from "@core/gl/global";
import { Mat4 } from "@core/math/Matrix";

class PerspectiveCamera extends Camera {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  constructor(fov: number, aspect: number, near: number, far: number) {
    super("perspective");
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const { fov, aspect, near, far } = this;
    const t = Math.tan(fov / 2) * near;
    const r = t * aspect;
    const l = -r;
    const b = -t;
    this.projectionMatrix = new Mat4([
      2 * near / (r - l), 0, (r + l) / (r - l), 0,
      0, 2 * near / (t - b), (t + b) / (t - b), 0,
      0, 0, -(far + near) / (near - far), -2 * far * near / (near - far),
      0, 0, -1, 0
    ]).glUniformArray();
    global.camera = this;
  }
}

export default PerspectiveCamera;
