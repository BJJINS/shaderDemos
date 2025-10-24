import { getCamera, getGL } from "@core/gl/global";
import {
  createIndexBuffer,
  createProgram,
  createProgramAttribute,
  createShader,
} from "@core/gl/utils";
import { Vec3 } from "@core/math/Vector";
import Object3D from "@core/scene/Object3D";
import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "./fragment.glsl";

class Tetrahedron {
  private points: Vec3[];
  private indices: number[][];
  public indexes!: Uint16Array;
  public vertices!: Float32Array;
  private subdivisions: number;
  private radius: number;
  constructor(subdivisions: number, radius: number) {
    this.subdivisions = subdivisions;
    this.radius = radius;
    this.points = [
      new Vec3(0, 0, -1),
      new Vec3(0, (2 * Math.sqrt(2)) / 3, 1 / 3),
      new Vec3(-Math.sqrt(6) / 3, -Math.sqrt(2) / 3, 1 / 3),
      new Vec3(Math.sqrt(6) / 3, -Math.sqrt(2) / 3, 1 / 3),
    ];
    this.indices = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 3, 2],
    ];
    this.createSphere();
  }

  subdivide() {
    const newIndices = [];
    const midpointCache = new Map();
    const getMidpointIndex = (i1: number, i2: number) => {
      const key = i1 < i2 ? `${i1}-${i2}` : `${i2}-${i1}`;
      if (midpointCache.has(key)) {
        return midpointCache.get(key)!;
      }
      const p1 = this.points[i1];
      const p2 = this.points[i2];
      const midpoint = new Vec3(
        (p1.x + p2.x) * 0.5,
        (p1.y + p2.y) * 0.5,
        (p1.z + p2.z) * 0.5
      ).normalize();
      this.points.push(midpoint);
      const len = this.points.length - 1;
      midpointCache.set(key, len);
      return len;
    };
    for (let i = 0; i < this.indices.length; i++) {
      const [a, b, c] = this.indices[i];
      const ab = getMidpointIndex(a, b);
      const bc = getMidpointIndex(b, c);
      const ca = getMidpointIndex(c, a);
      newIndices.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    this.indices = newIndices;
  }
  createSphere() {
    for (let i = 0; i < this.subdivisions; i++) {
      this.subdivide();
    }
    const vertices: number[] = [];
    for (let i = 0; i < this.points.length; i++) {
      const v = this.points[i];
      vertices.push(v.x * this.radius, v.y * this.radius, v.z * this.radius);
    }
    this.vertices = new Float32Array(vertices);
    const flat = this.indices.flat();
    this.indexes = new Uint16Array(flat);
  }
}

interface Param {
  radius?: number;
  subdivisions?: number;
  wireframe?: boolean;
}

class Sphere extends Object3D {
  subdivisions: number;
  wireframe: boolean;
  private lineIndices!: Uint16Array;
  constructor(param: Param) {
    super("sphere");
    const { radius = 1, subdivisions = 5, wireframe = false } = param;
    this.wireframe = wireframe;
    this.subdivisions = Math.min(subdivisions, 10);
    const tetrahedron = new Tetrahedron(this.subdivisions, radius);
    this.vertices = tetrahedron.vertices!;
    this.indices = tetrahedron.indexes!;

    if (wireframe) {
      const lineIdx: number[] = [];
      for (let i = 0; i < this.indices.length; i += 3) {
        const a = this.indices[i];
        const b = this.indices[i + 1];
        const c = this.indices[i + 2];
        lineIdx.push(a, b, b, c, c, a);
      }
      this.lineIndices = new Uint16Array(lineIdx);
    }

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
    createProgramAttribute(gl, program, 3, this.vertices, "aPosition", gl.FLOAT);
    createIndexBuffer(gl, this.wireframe ? this.lineIndices! : this.indices!);
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
    if (this.wireframe) {
      gl.drawElements(gl.LINES, this.lineIndices.length, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawElements(gl.TRIANGLES, this.indices!.length, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindVertexArray(null);
  }
}

export default Sphere;
