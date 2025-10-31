import { Mat4 } from "@core/math/Matrix";
import { Vec3 } from "@core/math/Vector";

type CameraType = "orthographic" | "perspective";

abstract class Camera {
  position = new Vec3();
  type: CameraType;
  viewMatrix = new Mat4().uniformMatrix;
  projectionMatrix = new Mat4().uniformMatrix; 
  viewMatrixDirty = false;
  projectionMatrixDirty = false;
  constructor(type: CameraType) {
    this.type = type;
  }
  lookAt(target: Vec3) {
    const view = target.sub(this.position).normalize();
    let up = new Vec3(0, 1, 0);
    const right = view.cross(up).normalize();
    up = right.cross(view).normalize();
    view.negate();
    // 将世界标架转换为相机标架
    // 先旋转再平移
    // -this.position.dot(right)、-this.position.dot(up)、-this.position.dot(view)
    // 分别是position在相机标架下的坐标，添加负号表示将该点转成原点(0,0,0)
    const viewMatrix = new Mat4([
      right.x,right.y,right.z,-this.position.dot(right),
      up.x,   up.y,   up.z,   -this.position.dot(up),
      view.x, view.y, view.z, -this.position.dot(view),
      0, 0, 0, 1,
    ]);
    this.viewMatrix = viewMatrix.uniformMatrix;
    this.viewMatrixDirty = true;
  }
  abstract updateProjectionMatrix(): void;
}

export default Camera;
