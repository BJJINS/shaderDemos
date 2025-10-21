import global from "@core/gl/global";
import { Mat4 } from "@core/math/Matrix";
import Camera from "@core/camera/Camera";

class OrthographicCamera extends Camera {
  left:number;
  right:number;
  bottom:number;
  top:number;
  near:number;
  far:number;
  constructor(left:number, right:number, bottom:number, top:number, near:number, far:number) {
    super("orthographic");
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }
  updateProjectionMatrix(){
    const {left,right,bottom,top,near,far} = this;
    // 将视锥体范围缩放到 -2到2（Z 轴需为负以匹配 OpenGL 的右手坐标与深度方向）
    const scaleMat4 = new Mat4([
      2/(right-left), 0,              0,              0,
      0,              2/(top-bottom), 0,              0,
      0,              0,              -2/(far-near),  0,
      0,              0,              0,              1
    ]);

    // 将视锥体的中心平移到坐标原点
    const translateMat4 = new Mat4([
      1, 0, 0, -(left + right) / 2,
      0, 1, 0, -(top + bottom) / 2,
      0, 0, 1, (far + near) / 2,
      0, 0, 0, 1
    ]);

    // 先平移后缩放
    this.projectionMatrix = scaleMat4.mult(translateMat4).glUniformArray();
    global.camera = this;
  }
}

export default OrthographicCamera;
