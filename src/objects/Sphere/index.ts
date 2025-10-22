import { createProgram, createProgramAttribute, createShader } from "@core/gl/utils";
import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "./fragment.glsl";
import { getCamera, getGL } from "@core/gl/global";
import Object3D from "@core/scene/Object3D";
import { Vec3 } from "@core/math/Vector";

interface SphereParams {
  radius: number;
  widthSegments?: number;  // 经度分段数
  heightSegments?: number; // 纬度分段数
  wireframe?: boolean;
  color?: Vec3;
}

class Sphere extends Object3D {
  vertexCount: number;
  wireframe: boolean;
  color: Vec3;
  constructor(params: SphereParams) {
    super();
    const { radius, widthSegments = 32, heightSegments = 16, wireframe = false, color = new Vec3(1, 1, 1) } = params;
    this.wireframe = wireframe;
    this.color = color;

    const positions: number[] = [];
    const colors: number[] = [];

    // 生成球体的顶点
    // 使用球坐标系：theta (极角，从上到下), phi (方位角，绕y轴旋转)
    for (let lat = 0; lat <= heightSegments; lat++) {
      const theta = (lat * Math.PI) / heightSegments; // 0 到 π
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= widthSegments; lon++) {
        const phi = (lon * 2 * Math.PI) / widthSegments; // 0 到 2π
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        // 球坐标转笛卡尔坐标
        const x = radius * sinTheta * cosPhi;
        const y = radius * cosTheta;
        const z = radius * sinTheta * sinPhi;

        // 顶点位置
        positions.push(x, y, z, 1.0);

        // 根据位置生成颜色（归一化坐标作为颜色）
        const r = (sinTheta * cosPhi + 1) / 2;
        const g = (cosTheta + 1) / 2;
        const b = (sinTheta * sinPhi + 1) / 2;
        colors.push(r, g, b);
      }
    }

    // 生成索引，构建三角形
    const indices: number[] = [];
    for (let lat = 0; lat < heightSegments; lat++) {
      for (let lon = 0; lon < widthSegments; lon++) {
        const first = lat * (widthSegments + 1) + lon;
        const second = first + widthSegments + 1;

        // 每个网格单元用两个三角形表示
        // 第一个三角形
        indices.push(first, second, first + 1);
        // 第二个三角形
        indices.push(second, second + 1, first + 1);
      }
    }

    // 根据索引重新组织顶点数据
    const indexedPositions: number[] = [];
    const indexedColors: number[] = [];
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      indexedPositions.push(
        positions[idx * 4],
        positions[idx * 4 + 1],
        positions[idx * 4 + 2],
        positions[idx * 4 + 3]
      );
      indexedColors.push(
        colors[idx * 3],
        colors[idx * 3 + 1],
        colors[idx * 3 + 2]
      );
    }

    this.vertices = new Float32Array(indexedPositions);
    this.colors = new Float32Array(indexedColors);
    this.vertexCount = indices.length;

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
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
    gl.bindVertexArray(null);
  }
}

export default Sphere;
