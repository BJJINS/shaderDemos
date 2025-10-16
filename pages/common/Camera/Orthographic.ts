import { Vec3 } from "../Vector";
import Camera from "./Camera";

class OrthographicCamera extends Camera {
  position = new Vec3(0, 0, 0);
  projectionMatrix: number[] = [];
  constructor(left:number, right:number, bottom:number, top:number, near:number, far:number) {
    super("orthographic");
    this.projectionMatrix = [
      2/(right-left),0,0,0,
      0,2/(top - bottom),0,0,
      0,0,-2/(far-near),0,
      0,0,0,1,
    ]
  }
  lookAt(target: Vec3) {
    const view = target.sub(this.position).normalize();
    let up = new Vec3(0, 1, 0);
    const right = view.cross(up);
    up = right.cross(view);
    view.negate();
    // 将世界标架转换为相机标架
    // 先旋转再平移
    // -this.position.dot(right)、-this.position.dot(up)、-this.position.dot(view)
    // 分别是position在相机标架下的坐标，添加负号表示将该点转成原点(0,0,0)
    const viewMatrix = [
      right.x,right.y,right.z,-this.position.dot(right),
      up.x,   up.y,   up.z,   -this.position.dot(up),
      view.x, view.y, view.z, -this.position.dot(view),
      0, 0, 0, 1,
    ];

    return viewMatrix;
  }
}

export default OrthographicCamera;
