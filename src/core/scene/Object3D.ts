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

interface Params {
  type: string;
  wireframe?: boolean;
  flatShading?: boolean;
}

export type Object3DParams = Pick<Params, "wireframe">;

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

  vertices!: Float32Array; // 顶点
  normals!: Float32Array; // 法线
  indices!: Uint16Array; // 索引
  colors!: Float32Array; // 颜色
  vao!: WebGLVertexArrayObject;

  lineIndics?: Uint16Array; // 线框模式索引
  wireframe = false; // 是否线框模式
  flatShading = false;
  type: string;

  constructor(params: Params) {
    const { type, wireframe = false, flatShading = false } = params;
    this.type = type;
    this.wireframe = wireframe;
    this.flatShading = flatShading;
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
    this.handleNormals();
    createProgramAttribute(gl, this.program, 3, this.vertices, "aPosition", gl.FLOAT);
    this.handleLineIndics();
    createIndexBuffer(gl, this.wireframe ? this.lineIndics! : this.indices!);
    createProgramAttribute(gl, this.program, 3, this.normals, "aNormal", gl.FLOAT);

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
    return translateMatrix.mult(scaleMatrix.mult(rotationQuaternionMatrix.mult(rotationMatrix)))
      .uniformMatrix;
  }
  // 通过顶点计算法线
  handleNormals() {
    if (this.flatShading) {
      const newVertices: number[] = [];
      const newNormals: number[] = [];
      const newIndices: number[] = [];
      let idx = 0;
      for (let i = 0; i < this.indices.length; i += 3) {
        const a = this.indices[i];
        const b = this.indices[i + 1];
        const c = this.indices[i + 2];

        const ax = this.vertices[a * 3],
          ay = this.vertices[a * 3 + 1],
          az = this.vertices[a * 3 + 2];
        const bx = this.vertices[b * 3],
          by = this.vertices[b * 3 + 1],
          bz = this.vertices[b * 3 + 2];
        const cx = this.vertices[c * 3],
          cy = this.vertices[c * 3 + 1],
          cz = this.vertices[c * 3 + 2];

        const bax = bx - ax,
          bay = by - ay,
          baz = bz - az;
        const cax = cx - ax,
          cay = cy - ay,
          caz = cz - az;
        let nx = bay * caz - baz * cay;
        let ny = baz * cax - bax * caz;
        let nz = bax * cay - bay * cax;
        const len = Math.hypot(nx, ny, nz);
        if (len > 1e-8) {
          nx /= len;
          ny /= len;
          nz /= len;
        } else {
          nx = 0;
          ny = 0;
          nz = 0;
        }

        newVertices.push(ax, ay, az, bx, by, bz, cx, cy, cz);
        newNormals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
        newIndices.push(idx, idx + 1, idx + 2);
        idx += 3;
      }
      this.vertices = new Float32Array(newVertices);
      this.normals = new Float32Array(newNormals);
      this.indices = new Uint16Array(newIndices);
    } else {
      const vertexCount = this.vertices.length / 3;
      const normals = new Float32Array(this.vertices.length);
      for (let i = 0; i < this.indices.length; i += 3) {
        const a = this.indices[i];
        const b = this.indices[i + 1];
        const c = this.indices[i + 2];

        const ax = this.vertices[a * 3],
          ay = this.vertices[a * 3 + 1],
          az = this.vertices[a * 3 + 2];
        const bx = this.vertices[b * 3],
          by = this.vertices[b * 3 + 1],
          bz = this.vertices[b * 3 + 2];
        const cx = this.vertices[c * 3],
          cy = this.vertices[c * 3 + 1],
          cz = this.vertices[c * 3 + 2];

        const bax = bx - ax,
          bay = by - ay,
          baz = bz - az;
        const cax = cx - ax,
          cay = cy - ay,
          caz = cz - az;

        const nx = bay * caz - baz * cay;
        const ny = baz * cax - bax * caz;
        const nz = bax * cay - bay * cax;

        normals[a * 3] += nx;
        normals[a * 3 + 1] += ny;
        normals[a * 3 + 2] += nz;
        normals[b * 3] += nx;
        normals[b * 3 + 1] += ny;
        normals[b * 3 + 2] += nz;
        normals[c * 3] += nx;
        normals[c * 3 + 1] += ny;
        normals[c * 3 + 2] += nz;
      }
      for (let i = 0; i < vertexCount; i++) {
        const ix = i * 3;
        const nx = normals[ix],
          ny = normals[ix + 1],
          nz = normals[ix + 2];
        const len = Math.hypot(nx, ny, nz);
        if (len > 1e-8) {
          normals[ix] = nx / len;
          normals[ix + 1] = ny / len;
          normals[ix + 2] = nz / len;
        } else {
          normals[ix] = 0;
          normals[ix + 1] = 0;
          normals[ix + 2] = 0;
        }
      }
      this.normals = normals;
    }
  }
  // 处理线框模式索引
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
    gl.uniformMatrix4fv(this.modelMatrixUniformLoc, true, this.modelMatrix());
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
