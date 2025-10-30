import global from "@core/gl/global";
import Quaternion from "@core/math/Quaternion";
import Transformation from "@core/math/Transform";
import { Vec3 } from "@core/math/Vector";
import { NormalMaterial } from "./../../Material/Material";
import { buildProgramWithPipeline, getUniformLocations } from "@core/scene/Object3D/shader";
import { prepareNormalAttributes } from "@core/scene/Object3D/geometry";
import { createObjectVAO, updateInstanceBuffer } from "@core/scene/Object3D/vao";

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
  normals?: Float32Array; // 法线
  indices?: Uint16Array; // 索引
  vao!: WebGLVertexArrayObject;

  lineIndics?: Uint16Array; // 线框模式索引
  wireframe = false; // 是否线框模式
  normalMode: "smooth" | "flat" = "smooth";
  type!: string;

  defines = {
    normal: false,
    light: false,
    instanced: false,
  };

  material = NormalMaterial;

  // Instancing
  instanced = false;
  instanceCount = 0;
  instanceMatrices?: Float32Array;
  instanceBuffer?: WebGLBuffer;

  constructor() {}
  public addChild(child: Object3D) {
    this.children.push(child);
  }
  public initializeObject(vertexShaderSource: string, fragmentShaderSource: string) {
    const gl = global.gl;

    const prepared = prepareNormalAttributes({
      vertices: this.vertices,
      indices: this.indices,
      wireframe: this.wireframe,
      normalMode: this.normalMode,
    });
    this.vertices = prepared.vertices;
    this.normals = prepared.normals;
    this.indices = prepared.indices;

    // Sync define for instancing
    this.defines.instanced = this.instanced;

    this.program = buildProgramWithPipeline(gl, {
      vertex: vertexShaderSource,
      fragment: fragmentShaderSource,
      defines: this.defines,
      normals: this.normals,
      material: this.material,
    });

    const { viewMatrixUniformLoc, projectionMatrixUniformLoc, modelMatrixUniformLoc } = getUniformLocations(gl, this.program);
    this.viewMatrixUniformLoc = viewMatrixUniformLoc;
    this.projectionMatrixUniformLoc = projectionMatrixUniformLoc;
    this.modelMatrixUniformLoc = modelMatrixUniformLoc;

    const { vao, lineIndics, instanceBuffer } = createObjectVAO(gl, this.program, {
      vertices: this.vertices,
      normals: this.normals,
      indices: this.indices,
      wireframe: this.wireframe,
      instanced: this.instanced,
      instanceMatrices: this.instanceMatrices,
    });
    this.vao = vao;
    this.lineIndics = lineIndics;
    this.instanceBuffer = instanceBuffer;
  }
  private computeRotationMatrix() {
    const xMat4 = Transformation.rotationX(this.rotation.x);
    const yMat4 = Transformation.rotationY(this.rotation.y);
    const zMat4 = Transformation.rotationZ(this.rotation.z);
    return xMat4.mult(yMat4.mult(zMat4));
  }
  private composeModelMatrix() {
    const rotationMatrix = this.computeRotationMatrix();
    const translateMatrix = Transformation.translate(this.position.x, this.position.y, this.position.z);
    const scaleMatrix = Transformation.scale(this.scale.x, this.scale.y, this.scale.z);
    return translateMatrix.mult(scaleMatrix.mult(this.quaternion.toMatrix().mult(rotationMatrix)))
      .uniformMatrix;
  }
  private uploadUniformMatrices(gl: WebGL2RenderingContext) {
    const camera = global.camera;
    gl.uniformMatrix4fv(this.viewMatrixUniformLoc, true, camera.viewMatrix);
    gl.uniformMatrix4fv(this.projectionMatrixUniformLoc, true, camera.projectionMatrix);
    gl.uniformMatrix4fv(this.modelMatrixUniformLoc, true, this.composeModelMatrix());
  }
  public updateInstanceMatrices(mats: Float32Array, count?: number) {
    if (!this.instanced || !this.instanceBuffer) return;
    const gl = global.gl;
    this.instanceMatrices = mats;
    if (typeof count === "number") this.instanceCount = count;
    updateInstanceBuffer(gl, this.vao, this.instanceBuffer, mats);
  }
  public renderObject() {
    const gl = global.gl;
    gl.useProgram(this.program);
    this.uploadUniformMatrices(gl);
    gl.bindVertexArray(this.vao);
    if (this.instanced) {
      const count = this.instanceCount;
      if (this.wireframe && this.lineIndics) {
        gl.drawElementsInstanced(gl.LINES, this.lineIndics.length, gl.UNSIGNED_SHORT, 0, count);
      } else if (this.indices) {
        gl.drawElementsInstanced(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0, count);
      } else {
        gl.drawArraysInstanced(gl.TRIANGLES, 0, this.vertices.length / 3, count);
      }
    } else {
      if (this.wireframe && this.lineIndics) {
        gl.drawElements(gl.LINES, this.lineIndics.length, gl.UNSIGNED_SHORT, 0);
      } else if (this.indices) {
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
      }
    }
    gl.bindVertexArray(null);
  }
}

export default Object3D;

