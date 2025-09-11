import { setIdentityM } from "./matrix.ts";

class MatrixState {
  constructor() {
    this.mProjMatrix = new Array(16); // 投影矩阵
    this.mVMatrix = new Array(16); // 摄像机矩阵
    this.currMatrix = new Array(16); // 基本变换矩阵
  }
  setInitStack() {
    this.currMatrix = new Array(16); // 创建用于存储矩阵元素的数组
    setIdentityM(this.currMatrix, 0); // 将元素填充为单位阵的元素值
  }
  setCamera(position, target, up) {
    
  }
}

export default MatrixState;
