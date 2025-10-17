import global from "../global";
import { Mat4 } from "../Matrix";
import { Vec3 } from "../Vector";
import Camera from "./Camera";

class OrthographicCamera extends Camera {
  position = new Vec3();
  projectionMatrix: Float32Array;
  viewMatrix = new Mat4().glUniformArray();
  constructor(left:number, right:number, bottom:number, top:number, near:number, far:number) {
    super("orthographic");

    const w = right - left;
    const h = top - bottom;
    const d = far - near;

    // 将视锥体范围缩放到 -2到2（Z 轴需为负以匹配 OpenGL 的右手坐标与深度方向）
    const scaleMat4 = new Mat4([
      2/w, 0,   0,   0,
      0,   2/h, 0,   0,
      0,   0,  -2/d, 0,
      0,   0,   0,   1
    ]);

    // 将视锥体的中心平移到坐标原点
    const translateMat4 = new Mat4([
      1, 0, 0, -(left + right) / 2,
      0, 1, 0, -(top + bottom) / 2,
      0, 0, 1,  (far + near)   / 2,
      0, 0, 0, 1
    ]);

    // 先平移后缩放
    this.projectionMatrix = scaleMat4.mult(translateMat4).glUniformArray();
    global.camera = this;
  }
  lookAt(target: Vec3) {
    const view = target.sub(this.position).normalize();
    let up = new Vec3(0, 1, 0);
    // 构建正交基并归一化，防止缩放误差
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
    this.viewMatrix = viewMatrix.glUniformArray();
  }
}

export default OrthographicCamera;