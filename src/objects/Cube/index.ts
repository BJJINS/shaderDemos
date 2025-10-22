import { createProgram, createProgramAttribute, createShader } from "@core/gl/utils";
import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "./fragment.glsl";
import { getCamera, getGL } from "@core/gl/global";
import { Vec3, Vec4 } from "@core/math/Vector";
import Object3D from "@core/scene/Object3D";

interface CubeParams {
  width: number;
  height: number;
  depth: number;
}

class Cube extends Object3D {
  constructor(params: CubeParams) {
    super();
    const { width, height, depth } = params;
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    const vertices = [
      new Vec4(-w, -h, d, 1), // 左下 前面
      new Vec4(-w, h, d, 1), // 左上 前面
      new Vec4(w, h, d, 1), // 右上 前面
      new Vec4(w, -h, d, 1), // 右下 前面
      new Vec4(-w, -h, -d, 1), // 左下 后面
      new Vec4(-w, h, -d, 1), // 左上 后面
      new Vec4(w, h, -d, 1), // 右上 后面
      new Vec4(w, -h, -d, 1), // 右下 后面
    ];

    const vertexColors = [
      new Vec3(0.0, 0.0, 0.0), // black
      new Vec3(1.0, 0.0, 0.0), // red
      new Vec3(1.0, 1.0, 0.0), // yellow
      new Vec3(0.0, 1.0, 0.0), // green
      new Vec3(0.0, 0.0, 1.0), // blue
      new Vec3(1.0, 0.0, 1.0), // magenta
      new Vec3(0.0, 1.0, 1.0), // cyan
      new Vec3(1.0, 1.0, 1.0), // white
    ];

    const position: number[] = [];
    const colors: number[] = [];
    const quad = (a: number, b: number, c: number, d: number) => {
      const indices = [a, b, c, a, c, d];
      for (let i = 0; i < indices.length; ++i) {
        const v = vertices[indices[i]];
        const vColor = vertexColors[a];
        position.push(v.x, v.y, v.z, v.w);
        colors.push(vColor.x, vColor.y, vColor.z);
      }
    };
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    this.vertices = new Float32Array(position);
    this.colors = new Float32Array(colors);

    const gl = getGL();
    this.program = this.initial(gl);
    this.viewMatrixUniformLoc = gl.getUniformLocation(this.program, "uViewMatrix")!;
    this.projectionMatrixUniformLoc = gl.getUniformLocation(this.program, "uProjectionMatrix")!;
    this.modelMatrixUniformLoc = gl.getUniformLocation(this.program, "uModelMatrix")!;
  }
  initial(gl: WebGL2RenderingContext) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    const program = createProgram(gl, vertexShader, fragmentShader)!;
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    createProgramAttribute(gl, program, 4, this.vertices, "aPosition", gl.FLOAT);
    createProgramAttribute(gl, program, 3, this.colors, "aColor", gl.FLOAT);
    gl.bindVertexArray(null);
    this.vao = vao;
    return program;
  }
  uniform(gl: WebGL2RenderingContext) {
    const camera = getCamera();
    gl.uniformMatrix4fv(this.viewMatrixUniformLoc, true, camera.viewMatrix);
    gl.uniformMatrix4fv(this.projectionMatrixUniformLoc, true, camera.projectionMatrix);
    gl.uniformMatrix4fv(this.modelMatrixUniformLoc, true, this.modelMatrix().glUniformArray());
  }
  render() {
    const gl = getGL();
    gl.useProgram(this.program);
    this.uniform(gl);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.bindVertexArray(null);
  }
}

export default Cube;
