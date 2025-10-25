import { Vec3 } from "@core/math/Vector";
import Object3D from "@core/scene/Object3D";
import fragmentShaderSource from "./fragment.glsl";
import vertexShaderSource from "./vertex.glsl";

class Tetrahedron {
  private initialVertices = [
    new Vec3(1, 1, 1).normalize(),
    new Vec3(-1, -1, 1).normalize(),
    new Vec3(-1, 1, -1).normalize(),
    new Vec3(1, -1, -1).normalize(),
  ];
  private initialIndices = [0, 2, 1, 0, 3, 2, 0, 1, 3, 2, 3, 1];
  private subdivisions: number;
  private cache: Map<string, number> = new Map();

  vertices!: Float32Array;
  indices!: Uint16Array;

  constructor(subdivisions = 4) {
    this.subdivisions = subdivisions;
    this.createSphere();
  }

  // 这个版本确定了一个顶点Vec3(0, 0, -1)，然后计算其他三个顶点
  // private createTetrahedron() {
  //   this.points = [
  //     new Vec3(0, 0, -1),
  //     new Vec3(0, (2 * Math.sqrt(2)) / 3, 1 / 3),
  //     new Vec3(-Math.sqrt(6) / 3, -Math.sqrt(2) / 3, 1 / 3),
  //     new Vec3(Math.sqrt(6) / 3, -Math.sqrt(2) / 3, 1 / 3),
  //   ];
  //   this.indices = [
  //     [0, 1, 2],
  //     [0, 2, 3],
  //     [0, 3, 1],
  //     [1, 3, 2],
  //   ];
  // }
  private getMidpointIndex(i1: number, i2: number) {
    const key = i1 > i2 ? `${i2}_${i1}` : `${i1}_${i2}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    const pointA = this.initialVertices[i1];
    const pointB = this.initialVertices[i2];
    const v = new Vec3(
      (pointA.x + pointB.x) * 0.5,
      (pointA.y + pointB.y) * 0.5,
      (pointA.z + pointB.z) * 0.5
    );
    v.normalize();
    this.initialVertices.push(v);
    const idx = this.initialVertices.length - 1;
    this.cache.set(key, idx);
    return idx;
  }

  private subdivide() {
    const newIndics: number[] = [];
    for (let i = 0; i < this.initialIndices.length; i += 3) {
      const a = this.initialIndices[i];
      const b = this.initialIndices[i + 1];
      const c = this.initialIndices[i + 2];
      const ab = this.getMidpointIndex(a, b);
      const ac = this.getMidpointIndex(a, c);
      const bc = this.getMidpointIndex(b, c);
      // 4 个子三角形: (a, ab, ac), (b, bc, ab), (c, ac, bc), (ab, bc, ac)
      newIndics.push(a, ab, ac, b, bc, ab, c, ac, bc, ab, bc, ac);
    }
    this.initialIndices = newIndics;
  }
  private createSphere() {
    for (let i = 0; i < this.subdivisions; i++) {
      this.subdivide();
    }
    this.vertices = new Float32Array(
      this.initialVertices.reduce((res, point) => {
        res.push(point.x, point.y, point.z);
        return res;
      }, [] as number[])
    );
    this.indices = new Uint16Array(this.initialIndices);
  }
}

interface Param {
  radius?: number;
  subdivisions?: number;
  wireframe?: boolean;
}

class Sphere extends Object3D {
  radius: number;
  subdivisions: number;
  constructor(param: Param) {
    const { radius = 1, subdivisions = 4, wireframe = false } = param;
    super("sphere");
    this.radius = radius;
    this.scale.scale(radius);
    this.wireframe = wireframe;
    this.subdivisions = Math.min(subdivisions, 10);
    const tetrahedronSphere = new Tetrahedron(subdivisions);
    this.vertices = tetrahedronSphere.vertices;
    this.indices = tetrahedronSphere.indices;
    

    this.initial(vertexShaderSource, fragmentShaderSource);
  }
}

export default Sphere;
