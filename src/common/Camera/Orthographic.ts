import global from "../global";
import { Mat4 } from "../Matrix";
import Camera from "./Camera";

class OrthographicCamera extends Camera {
  projectionMatrix: Float32Array;
  constructor(left:number, right:number, bottom:number, top:number, near:number, far:number) {
    super("orthographic");

    near = -near;
    far = -far;
    const w = right - left;
    const h = top - bottom;
    const d = far - near;

    // 将视锥体范围缩放到 -2到2（Z 轴需为负以匹配 OpenGL 的右手坐标与深度方向）
    const scaleMat4 = new Mat4([
      2/w, 0,   0,   0,
      0,   2/h, 0,   0,
      0,   0,  2/d, 0,
      0,   0,   0,   1
    ]);

    // 将视锥体的中心平移到坐标原点
    const translateMat4 = new Mat4([
      1, 0, 0, -(left + right) / 2,
      0, 1, 0, -(top + bottom) / 2,
      0, 0, 1,  -(far + near)   / 2,
      0, 0, 0, 1
    ]);

    // 先平移后缩放
    this.projectionMatrix = scaleMat4.mult(translateMat4).glUniformArray();
    global.camera = this;
  }
}

export default OrthographicCamera;