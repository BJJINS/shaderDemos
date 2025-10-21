import Camera from "@core/camera/Camera";
import global from "@core/gl/global";
import { degreesToRadians } from "@core/gl/utils";
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
    const f = 1.0 / Math.tan( degreesToRadians(fov) / 2 );
    const d = far - near;
    this.projectionMatrix = new Mat4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, -(far + near) / d, -2 * far * near / d,
      0, 0, -1, 0
    ]).glUniformArray();
    global.camera = this;
  }
}

export default PerspectiveCamera;
