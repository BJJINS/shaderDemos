import global from "@core/gl/global";
import {
  createIndexBuffer,
  createProgram,
  createProgramAttribute,
  createShader,
  generateFlatNormals,
  generateSmoothNormals,
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
  };

  material = NormalMaterial;

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
    createProgramAttribute(gl, this.program, 3, this.normals, "aNormal", gl.FLOAT);

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
  // 通过顶点计算法线
  private prepareNormalAttributes() {
    if (this.wireframe) {
      return;
    }
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
