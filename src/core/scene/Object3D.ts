import global from "@core/gl/global";
import Quaternion from "@core/math/Quaternion";
import Transformation from "@core/math/Transform";
import { Vec3 } from "@core/math/Vector";
import { NormalMaterial } from "./../../Material/Material";
import {
  buildProgramWithPipeline,
  buildWireframeProgramWithPipeline,
} from "@core/scene/Object3D/shader";
import { prepareNormalAttributes } from "@core/scene/Object3D/geometry";
import { createObjectVAO, updateInstanceBuffer } from "@core/scene/Object3D/vao";
import vertexShaderSource from "@shaders/vertex.glsl";
import fragmentShaderSource from "@shaders/fragment.glsl";
import wireframeVertexShaderSource from "@shaders/wireframe/vertex.glsl";
import wireframeFragmentShaderSource from "@shaders/wireframe/fragment.glsl";
import type BlinnPhongLight from "./Light";

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

  uniforms: Record<string, WebGLUniformLocation> = {
    viewMatrix: null!,
    projectionMatrix: null!,
    modelMatrix: null!,
    lightPosition: null!,
    shininess: null!,
    ambientProduct: null!,
    diffuseProduct: null!,
    specularProduct: null!,
  };

  vertices!: Float32Array; // 顶点
  normals?: Float32Array; // 法线
  indices?: Uint16Array; // 索引
  vao!: WebGLVertexArrayObject;

  lineIndics?: Uint16Array; // 线框模式索引
  wireframe = false; // 是否线框模式
  normalMode: "smooth" | "flat" = "smooth";
  type!: string;

  defines = {
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
  public initializeObject(light: BlinnPhongLight) {
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

    this.defines.instanced = this.instanced;

    if (this.wireframe) {
      this.program = buildWireframeProgramWithPipeline(gl, {
        vertex: wireframeVertexShaderSource,
        fragment: wireframeFragmentShaderSource,
        defines: this.defines,
      });
    } else {
      this.program = buildProgramWithPipeline(gl, {
        vertex: vertexShaderSource,
        fragment: fragmentShaderSource,
        defines: this.defines,
      });
    }



    this.uniforms.viewMatrix = gl.getUniformLocation(this.program, "uViewMatrix")!;
    this.uniforms.projectionMatrix = gl.getUniformLocation(this.program, "uProjectionMatrix")!;
    this.uniforms.modelMatrix = gl.getUniformLocation(this.program, "uModelMatrix")!;
    this.uniforms.lightPosition = gl.getUniformLocation(this.program, "uLightPosition")!;
    this.uniforms.shininess = gl.getUniformLocation(this.program, "uShininess")!;
    this.uniforms.ambientProduct = gl.getUniformLocation(this.program, "uAmbientProduct")!;
    this.uniforms.diffuseProduct = gl.getUniformLocation(this.program, "uDiffuseProduct")!;
    this.uniforms.specularProduct = gl.getUniformLocation(this.program, "uSpecularProduct")!;



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
    const translateMatrix = Transformation.translate(
      this.position.x,
      this.position.y,
      this.position.z
    );
    const scaleMatrix = Transformation.scale(this.scale.x, this.scale.y, this.scale.z);
    return translateMatrix.mult(scaleMatrix.mult(this.quaternion.toMatrix().mult(rotationMatrix)))
      .uniformMatrix;
  }
  private uploadUniformMatrices(gl: WebGL2RenderingContext) {
    const camera = global.camera;
    if (camera.viewMatrixDirty) {
      gl.uniformMatrix4fv(this.uniforms.viewMatrix, true, camera.viewMatrix);
      camera.viewMatrixDirty = false;
    }
    if (camera.projectionMatrixDirty) {
      gl.uniformMatrix4fv(this.uniforms.projectionMatrix, true, camera.projectionMatrix);
      camera.projectionMatrixDirty = false;
    }
    gl.uniformMatrix4fv(this.uniforms.modelMatrix, true, this.composeModelMatrix());
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
