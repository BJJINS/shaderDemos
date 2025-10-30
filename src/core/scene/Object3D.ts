import global from "@core/gl/global";
import {
  createIndexBuffer,
  createProgram,
  createProgramAttribute,
  createShader,
  generateFlatNormals,
  generateSmoothNormals,
  createInstancedMat4Attribute,
} from "@core/gl/utils";
import Quaternion from "@core/math/Quaternion";
import Transformation from "@core/math/Transform";
import { Vec3 } from "@core/math/Vector";
import { NormalMaterial } from "./../../Material/Material";
import { withDefaultObject3DProcessors } from "@core/shader/ShaderPipeline";

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
  private initializeUniformLocations(gl: WebGL2RenderingContext) {
    this.viewMatrixUniformLoc = gl.getUniformLocation(this.program, "uViewMatrix")!;
    this.projectionMatrixUniformLoc = gl.getUniformLocation(this.program, "uProjectionMatrix")!;
    this.modelMatrixUniformLoc = gl.getUniformLocation(this.program, "uModelMatrix")!;
  }
  public initializeObject(vertexShaderSource: string, fragmentShaderSource: string) {
    const gl = global.gl;

    this.prepareNormalAttributes();
    // Sync define for instancing
    this.defines.instanced = this.instanced;
    const pipeline = withDefaultObject3DProcessors();
    const processed = pipeline.run(
      { vertex: vertexShaderSource, fragment: fragmentShaderSource },
      { defines: this.defines, normals: this.normals, material: this.material }
    );

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, processed.vertex)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, processed.fragment)!;
    this.program = createProgram(gl, vertexShader, fragmentShader)!;

    this.initializeUniformLocations(gl);

    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    createProgramAttribute(gl, this.program, 3, this.vertices, "aPosition", gl.FLOAT);
    if (this.normals) {
      createProgramAttribute(gl, this.program, 3, this.normals, "aNormal", gl.FLOAT);
    }
    this.prepareWireframeIndices(gl);
    if (!this.wireframe && this.indices) {
      createIndexBuffer(gl, this.indices!);
    }

    if (this.instanced && this.instanceMatrices) {
      this.instanceBuffer = createInstancedMat4Attribute(gl, this.program, "aInstanceMatrix", this.instanceMatrices);
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
  private composeModelMatrix() {
    const rotationMatrix = this.computeRotationMatrix();
    const translateMatrix = Transformation.translate(this.position.x, this.position.y, this.position.z);
    const scaleMatrix = Transformation.scale(this.scale.x, this.scale.y, this.scale.z);
    return translateMatrix.mult(scaleMatrix.mult(this.quaternion.toMatrix().mult(rotationMatrix)))
      .uniformMatrix;
  }
  // 通过顶点计算法线
  private prepareNormalAttributes() {
    if (this.wireframe) return;
    if (this.normalMode === "flat") {
      const { vertices, normals } = generateFlatNormals(this.indices!, this.vertices);
      this.vertices = vertices;
      this.normals = normals;
      this.indices = undefined;
    } else {
      this.normals = generateSmoothNormals(this.indices!, this.vertices!);
    }
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
      createIndexBuffer(gl, this.lineIndics!);
    }
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
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mats, gl.DYNAMIC_DRAW);
    gl.bindVertexArray(null);
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

