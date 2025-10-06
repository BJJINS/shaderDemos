import { createProgram, createProgramAttribute, createShader } from "../utils";
import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "./fragment.glsl";
import global from "../global";

interface CubeParams {
  width: number;
  height: number;
  depth: number;
}

class Cube {
  program: WebGLProgram;
  constructor(params: CubeParams) {
    const { width, height, depth } = params;
    const { gl } = global;
    if (!gl) {
      throw new Error("gl is null");
    }
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    this.program = createProgram(gl, vertexShader, fragmentShader)!;
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;
    // 为每个面创建独立的顶点数据（每个面4个顶点，共24个顶点）
    const vertices = new Float32Array([
      // 正面 (0-3)
      -w,
      h,
      d, // 0: 左上
      -w,
      -h,
      d, // 1: 左下
      w,
      h,
      d, // 2: 右上
      w,
      -h,
      d, // 3: 右下

      // 背面 (4-7)
      -w,
      h,
      -d, // 4: 左上
      -w,
      -h,
      -d, // 5: 左下
      w,
      h,
      -d, // 6: 右上
      w,
      -h,
      -d, // 7: 右下

      // 左面 (8-11)
      -w,
      h,
      d, // 8: 前上
      -w,
      -h,
      d, // 9: 前下
      -w,
      h,
      -d, // 10: 后上
      -w,
      -h,
      -d, // 11: 后下

      // 右面 (12-15)
      w,
      h,
      d, // 12: 前上
      w,
      -h,
      d, // 13: 前下
      w,
      h,
      -d, // 14: 后上
      w,
      -h,
      -d, // 15: 后下

      // 上面 (16-19)
      -w,
      h,
      d, // 16: 前左
      w,
      h,
      d, // 17: 前右
      -w,
      h,
      -d, // 18: 后左
      w,
      h,
      -d, // 19: 后右

      // 下面 (20-23)
      -w,
      -h,
      d, // 20: 前左
      w,
      -h,
      d, // 21: 前右
      -w,
      -h,
      -d, // 22: 后左
      w,
      -h,
      -d, // 23: 后右
    ]);

    const indices = new Uint8Array([
      // 正面 (0-3)
      0, 1, 2, 2, 1, 3,

      // 背面 (4-7)
      4, 5, 6, 6, 5, 7,

      // 左面 (8-11)
      8, 9, 10, 10, 9, 11,

      // 右面 (12-15)
      12, 13, 14, 14, 13, 15,

      // 上面 (16-19)
      16, 17, 18, 18, 17, 19,

      // 下面 (20-23)
      20, 21, 22, 22, 21, 23,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    const vertexColors = new Float32Array([
      // 正面 - 红色 (4个顶点)
      1.0,
      0.0,
      0.0, // 顶点0
      1.0,
      0.0,
      0.0, // 顶点1
      1.0,
      0.0,
      0.0, // 顶点2
      1.0,
      0.0,
      0.0, // 顶点3

      // 背面 - 蓝色 (4个顶点)
      0.0,
      0.0,
      1.0, // 顶点4
      0.0,
      0.0,
      1.0, // 顶点5
      0.0,
      0.0,
      1.0, // 顶点6
      0.0,
      0.0,
      1.0, // 顶点7

      // 左面 - 绿色 (4个顶点)
      0.0,
      1.0,
      0.0, // 顶点8
      0.0,
      1.0,
      0.0, // 顶点9
      0.0,
      1.0,
      0.0, // 顶点10
      0.0,
      1.0,
      0.0, // 顶点11

      // 右面 - 黄色 (4个顶点)
      1.0,
      1.0,
      0.0, // 顶点12
      1.0,
      1.0,
      0.0, // 顶点13
      1.0,
      1.0,
      0.0, // 顶点14
      1.0,
      1.0,
      0.0, // 顶点15

      // 上面 - 青色 (4个顶点)
      0.0,
      1.0,
      1.0, // 顶点16
      0.0,
      1.0,
      1.0, // 顶点17
      0.0,
      1.0,
      1.0, // 顶点18
      0.0,
      1.0,
      1.0, // 顶点19

      // 下面 - 品红色 (4个顶点)
      1.0,
      0.0,
      1.0, // 顶点20
      1.0,
      0.0,
      1.0, // 顶点21
      1.0,
      0.0,
      1.0, // 顶点22
      1.0,
      0.0,
      1.0, // 顶点23
    ]);

    createProgramAttribute(gl, this.program, 3, vertices, "aPosition", gl.FLOAT);
    createProgramAttribute(gl, this.program, 3, vertexColors, "aColor", gl.FLOAT);
    this.projectionMatrix();
  }
  render() {
    const { gl } = global;
    if (!gl) {
      throw new Error("gl is null");
    }
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
  }
  projectionMatrix() {
    const { camera, gl } = global;
    if (!camera) {
      throw new Error("camera is null");
    }
    if (!gl) {
      throw new Error("gl is null");
    }
    const matrixLoc = gl.getUniformLocation(this.program, "uProjectionMatrix");
    gl.uniformMatrix4fv(matrixLoc, false, camera.matrix);
  }
}

export default Cube;
