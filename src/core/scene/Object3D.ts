import { getCamera, getGL } from "@core/gl/global";
import {
  createIndexBuffer,
  createProgram,
  createProgramAttribute,
  createShader,
} from "@core/gl/utils";
import Quaternion from "@core/math/Quaternion";
import Transformation from "@core/math/Transform";
import { Vec3 } from "@core/math/Vector";

class Object3D {
  position = new Vec3();
  rotation = new Vec3();
  scale = new Vec3(1, 1, 1);
  children: Object3D[] = [];
  quaternion = new Quaternion();
  program!: WebGLProgram;
  viewMatrixUniformLoc!: WebGLUniformLocation;
  projectionMatrixUniformLoc!: WebGLUniformLocation;
  modelMatrixUniformLoc!: WebGLUniformLocation;

  vertices!: Float32Array;
  indices?: Uint16Array;
  colors!: Float32Array;
  vao!: WebGLVertexArrayObject;

  lineIndics?: Uint16Array;
  wireframe = false;
  type: string;

  constructor(type: string, wireframe = false) {
    this.type = type;
    this.wireframe = wireframe;
  }
  add(child: Object3D) {
    this.children.push(child);
  }
  initial(vertexShaderSource: string, fragmentShaderSource: string) {
    const gl = getGL();
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
    this.program = createProgram(gl, vertexShader, fragmentShader)!;

    this.viewMatrixUniformLoc = gl.getUniformLocation(this.program, "uViewMatrix")!;
    this.projectionMatrixUniformLoc = gl.getUniformLocation(this.program, "uProjectionMatrix")!;
    this.modelMatrixUniformLoc = gl.getUniformLocation(this.program, "uModelMatrix")!;

    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    createProgramAttribute(gl, this.program, 3, this.vertices, "aPosition", gl.FLOAT);
    if (this.wireframe) {
      this.handleLineIndics();
      createIndexBuffer(gl, this.lineIndics!);
    } else {
      createIndexBuffer(gl, this.indices!);
    }
    gl.bindVertexArray(null);
    this.vao = vao;
  }
  handleRotation() {
    const xMat4 = Transformation.rotationX(this.rotation.x);
    const yMat4 = Transformation.rotationY(this.rotation.y);
    const zMat4 = Transformation.rotationZ(this.rotation.z);
    return xMat4.mult(yMat4.mult(zMat4));
  }
  handlePosition() {
    const { x, y, z } = this.position;
    return Transformation.translate(x, y, z);
  }
  handleScale() {
    const { x, y, z } = this.scale;
    return Transformation.scale(x, y, z);
  }
  handleQuaternion() {
    return this.quaternion.toMatrix();
  }
  modelMatrix() {
    const rotationMatrix = this.handleRotation();
    const rotationQuaternionMatrix = this.handleQuaternion();
    const translateMatrix = this.handlePosition();
    const scaleMatrix = this.handleScale();
    return translateMatrix.mult(scaleMatrix.mult(rotationQuaternionMatrix.mult(rotationMatrix)));
  }
  // 处理线框模式
  handleLineIndics() {
    if (this.wireframe && this.indices) {
      const lineIndics: number[] = [];
      for (let i = 0; i < this.indices.length; i += 3) {
        const a = this.indices[i];
        const b = this.indices[i + 1];
        const c = this.indices[i + 2];
        lineIndics.push(a, b, b, c, a, c);
      }
      this.lineIndics = new Uint16Array(lineIndics);
    }
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
    if (this.wireframe) {
      gl.drawElements(gl.LINES, this.lineIndics!.length, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawElements(gl.TRIANGLES, this.indices!.length, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindVertexArray(null);
  }
}

export default Object3D;
