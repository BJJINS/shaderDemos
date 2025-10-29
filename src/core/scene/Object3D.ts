import global from "@core/gl/global";
import {
  createIndexBuffer,
  createProgram,
  createProgramAttribute,
  createShader,
} from "@core/gl/utils";
import Quaternion from "@core/math/Quaternion";
import Transformation from "@core/math/Transform";
import { Vec3 } from "@core/math/Vector";
import type Material from "src/Material/Material";
import { NormalMaterial } from "./../../Material/Material";

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
  indices?: Uint16Array; // 索引
  vao!: WebGLVertexArrayObject;

  lineIndics?: Uint16Array; // 线框模式索引
  wireframe = false; // 是否线框模式
  normalMode: "smooth" | "flat" = "smooth";
  type!: string;

  defines = {
    normal: false,
  };

  material: Material;

  constructor(material = NormalMaterial) {
    this.material = material;
  }
  public addChild(child: Object3D) {
    this.children.push(child);
  }
  private initializeUniformLocations(gl: WebGL2RenderingContext) {
    this.viewMatrixUniformLoc = gl.getUniformLocation(this.program, "uViewMatrix")!;
    this.projectionMatrixUniformLoc = gl.getUniformLocation(this.program, "uProjectionMatrix")!;
    this.modelMatrixUniformLoc = gl.getUniformLocation(this.program, "uModelMatrix")!;
  }

  private applyMaterialColor(fragmentShaderSource: string) {
    const { x, y, z, w } = this.material.color;
    return fragmentShaderSource.replace("{{ color }}", `vec4(${x}, ${y}, ${z}, ${w})`);
  }

  private applyShaderDefines(vertexShaderSource: string) {
    this.defines.normal = !!this.normals;

    const keys = Object.keys(this.defines);
    let str = "";
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof typeof this.defines;
      if (this.defines[key]) {
        str += `#define ${key.toUpperCase()}\n`;
      }
    }
    return vertexShaderSource.replace("{{ defines }}", str);
  }
  public initializeObject(vertexShaderSource: string, fragmentShaderSource: string) {
    const gl = global.gl;

    const vertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      this.applyShaderDefines(vertexShaderSource)
    )!;
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      this.applyMaterialColor(fragmentShaderSource)
    )!;
    this.program = createProgram(gl, vertexShader, fragmentShader)!;

    this.initializeUniformLocations(gl);

    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    this.prepareNormalAttributes(gl);

    createProgramAttribute(gl, this.program, 3, this.vertices, "aPosition", gl.FLOAT);

    this.prepareWireframeIndices(gl);

    if (!this.wireframe && this.indices) {
      createIndexBuffer(gl, this.indices!);
    }
    gl.bindVertexArray(null);
    this.vao = vao;
  }
  private computeRotationMatrix() {
    const xMat4 = Transformation.rotationX(this.rotation.x);
    const yMat4 = Transformation.rotationY(this.rotation.y);
    const zMat4 = Transformation.rotationZ(this.rotation.z);
    return xMat4.mult(yMat4.mult(zMat4));
  }
  private computeTranslationMatrix() {
    const { x, y, z } = this.position;
    return Transformation.translate(x, y, z);
  }
  private computeScaleMatrix() {
    const { x, y, z } = this.scale;
    return Transformation.scale(x, y, z);
  }
  private computeQuaternionMatrix() {
    return this.quaternion.toMatrix();
  }
  private composeModelMatrix() {
    const rotationMatrix = this.computeRotationMatrix();
    const rotationQuaternionMatrix = this.computeQuaternionMatrix();
    const translateMatrix = this.computeTranslationMatrix();
    const scaleMatrix = this.computeScaleMatrix();
    return translateMatrix.mult(scaleMatrix.mult(rotationQuaternionMatrix.mult(rotationMatrix)))
      .uniformMatrix;
  }
  private generateFlatNormals() {
    const normals: number[] = [];
    const vertices: number[] = [];
    for (let i = 0; i < this.indices!.length; i += 3) {
      const ia = this.indices![i];
      const ib = this.indices![i + 1];
      const ic = this.indices![i + 2];

      const a = new Vec3(
        this.vertices[ia * 3],
        this.vertices[ia * 3 + 1],
        this.vertices[ia * 3 + 2]
      );
      const b = new Vec3(
        this.vertices[ib * 3],
        this.vertices[ib * 3 + 1],
        this.vertices[ib * 3 + 2]
      );
      const c = new Vec3(
        this.vertices[ic * 3],
        this.vertices[ic * 3 + 1],
        this.vertices[ic * 3 + 2]
      );

      const ba = b.clone().sub(a);
      const ca = c.clone().sub(a);
      const normal = ba.cross(ca).normalize();

      vertices.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
      normals.push(
        normal.x,
        normal.y,
        normal.z,
        normal.x,
        normal.y,
        normal.z,
        normal.x,
        normal.y,
        normal.z
      );
    }
    this.vertices = new Float32Array(vertices);
    this.normals = new Float32Array(normals);
    this.indices = undefined;
  }
  private generateSmoothNormals() {
    const normals = new Float32Array(this.vertices.length);
    for (let i = 0; i < this.indices!.length; i += 3) {
      const i3 = i * 3;
      const ia = this.indices![i3];
      const ib = this.indices![i3 + 1];
      const ic = this.indices![i3 + 2];
      const a = new Vec3(this.vertices[ia], this.vertices[ia + 1], this.vertices[ia + 2]);
      const b = new Vec3(this.vertices[ib], this.vertices[ib + 1], this.vertices[ib + 2]);
      const c = new Vec3(this.vertices[ic], this.vertices[ic + 1], this.vertices[ic + 2]);

      const ba = b.clone().sub(a);
      const ca = c.clone().sub(a);
      const normal = ba.cross(ca).normalize();

      normals[ia] = normal.x;
      normals[ia + 1] = normal.y;
      normals[ia + 2] = normal.z;

      normals[ib] = normal.x;
      normals[ib + 1] = normal.y;
      normals[ib + 2] = normal.z;

      normals[ic] = normal.x;
      normals[ic + 1] = normal.y;
      normals[ic + 2] = normal.z;
    }
    this.normals = normals;
  }
  // 通过顶点计算法线
  private prepareNormalAttributes(gl: WebGL2RenderingContext) {
    if (this.wireframe) {
      return;
    }
    if (this.normalMode === "flat") {
      this.generateFlatNormals();
    } else {
      this.generateSmoothNormals();
    }
    createProgramAttribute(gl, this.program, 3, this.normals, "aNormal", gl.FLOAT);
  }
  // 处理线框模式索引
  private prepareWireframeIndices(gl: WebGL2RenderingContext) {
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
    createIndexBuffer(gl, this.lineIndics!);
  }
  private uploadUniformMatrices(gl: WebGL2RenderingContext) {
    const camera = global.camera;
    gl.uniformMatrix4fv(this.viewMatrixUniformLoc, true, camera.viewMatrix);
    gl.uniformMatrix4fv(this.projectionMatrixUniformLoc, true, camera.projectionMatrix);
    gl.uniformMatrix4fv(this.modelMatrixUniformLoc, true, this.composeModelMatrix());
  }
  public renderObject() {
    const gl = global.gl;
    gl.useProgram(this.program);
    this.uploadUniformMatrices(gl);
    gl.bindVertexArray(this.vao);
    if (this.wireframe) {
      gl.drawElements(gl.LINES, this.lineIndics!.length, gl.UNSIGNED_SHORT, 0);
    } else if (this.indices) {
      gl.drawElements(gl.TRIANGLES, this.indices!.length, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
    gl.bindVertexArray(null);
  }
}

export default Object3D;
