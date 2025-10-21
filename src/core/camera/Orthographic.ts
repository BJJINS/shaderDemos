import global from "@core/gl/global";
import { Mat4 } from "@core/math/Matrix";
import Camera from "@core/camera/Camera";

class OrthographicCamera extends Camera {
  projectionMatrix: Float32Array;
  constructor(l:number, r:number, b:number, t:number, n:number, f:number) {
    super("orthographic");

    n = -n;
    f = -f;

    // 将视锥体范围缩放到 -2到2（Z 轴需为负以匹配 OpenGL 的右手坐标与深度方向）
    const scaleMat4 = new Mat4([
      2/(r-l), 0,       0,       0,
      0,       2/(t-b), 0,       0,
      0,       0,       2/(n-f), 0,
      0,       0,       0,       1
    ]);

    // 将视锥体的中心平移到坐标原点
    const translateMat4 = new Mat4([
      1, 0, 0, -(l + r) / 2,
      0, 1, 0, -(t + b) / 2,
      0, 0, 1, -(f + n) / 2,
      0, 0, 0, 1
    ]);

    // 先平移后缩放
    this.projectionMatrix = scaleMat4.mult(translateMat4).glUniformArray();
    global.camera = this;
  }
}

export default OrthographicCamera;
