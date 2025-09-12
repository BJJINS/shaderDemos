import { setIdentity, setLookAt } from "./matrix.ts";

class MatrixState {
  mProjMatrix = new Array(16) as Matrix4; // 投影矩阵
  mVMatrix = new Array(16) as Matrix4; // 摄像机矩阵
  currMatrix = new Array(16) as Matrix4; // 基本变换矩阵
  constructor() {
    this.setInitStack();
    this.setCamera(
      { x: 0, y: 0, z: -5 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 }
    );
  }
  setInitStack() {
    setIdentity(this.currMatrix, 0); // 将元素填充为单位阵的元素值
  }
  setCamera(position: Vector3, target: Vector3, up: Vector3) {
    setLookAt(this.mVMatrix, 0, position, target, up);
  }
  // 设置透视投影参数
  setProjectFrustum() {}
  // 设置正交投影参数
  setProjectOrtho(
    left: number, //near面的left
    right: number, //near面的right
    bottom: number, //near面的bottom
    top: number, //near面的top
    near: number, //near面与视点的距离
    far: number //far面与视点的距离
  ) {}
}

export default MatrixState;
