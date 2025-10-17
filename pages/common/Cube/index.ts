import { createProgram, createProgramAttribute, createShader } from "../utils";
import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "./fragment.glsl";
import { getGL } from "../global";
import { Vec4 } from "../Vector";
import Object3D from "../Object3D";

interface CubeParams {
  width: number;
  height: number;
  depth: number;
}

class Cube extends Object3D {
  quaternion = true;
  defines = "";
  positions = Array<number>();
  colors = Array<number>();
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
      new Vec4(0.0, 0.0, 0.0, 1.0), // black
      new Vec4(1.0, 0.0, 0.0, 1.0), // red
      new Vec4(1.0, 1.0, 0.0, 1.0), // yellow
      new Vec4(0.0, 1.0, 0.0, 1.0), // green
      new Vec4(0.0, 0.0, 1.0, 1.0), // blue
      new Vec4(1.0, 0.0, 1.0, 1.0), // magenta
      new Vec4(0.0, 1.0, 1.0, 1.0), // cyan
      new Vec4(1.0, 1.0, 1.0, 1.0), // white
    ];

    const quad = (a: number, b: number, c: number, d: number) => {
      const indices = [a, b, c, a, c, d];
      for (var i = 0; i < indices.length; ++i) {
        const v = vertices[indices[i]];
        const vColor = vertexColors[a];
        this.positions.push(v.x, v.y, v.z, v.w);
        this.colors.push(vColor.x, vColor.y, vColor.z, vColor.w);
      }
    };
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
  }
  initialRotation(program: WebGLProgram) {
    const gl = getGL();
    const rotationUniformLoc = gl!.getUniformLocation(program, "uRotation")!;
    const [x, y, z] = this.rotation;
    if (x > 0 || y > 0 || z > 0) {
      gl.uniform3fv(rotationUniformLoc, this.rotation);
    }
  }

  initialCube() {
    const gl = getGL();
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, this.definesControl())!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    const program = createProgram(gl, vertexShader, fragmentShader)!;
    const vertices = new Float32Array(this.positions);
    const vertexColors = new Float32Array(this.colors);
    createProgramAttribute(gl, program, 4, vertices, "aPosition", gl.FLOAT);
    createProgramAttribute(gl, program, 4, vertexColors, "aColor", gl.FLOAT);
    return program;
  }
  render() {
    const gl = getGL();
    const program = this.initialCube();
    this.initialRotation(program);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }
  rotateY(angle: number) {
    this.rotation[1] = angle;
  }
  rotateX(angle: number) {
    this.rotation[0] = angle;
  }
  rotateZ(angle: number) {
    this.rotation[2] = angle;
  }
  definesControl() {
    if (this.quaternion) {
      this.defines += "#define ENABLE_QUATERNION\n";
    }
    return vertexShaderSource.replace("{{DEFINES}}", this.defines);
  }
}

export default Cube;
