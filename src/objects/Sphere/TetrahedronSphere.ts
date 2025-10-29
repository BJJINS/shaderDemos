import Object3D from "@core/scene/Object3D";
import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "./fragment.glsl";
import { Vec3 } from "@core/math/Vector";

interface TetrahedronSphereParams {
  radius?: number;
  subdivisions?: number;
  wireframe?: boolean;
}

const TetrahedronSphereVertices = [
  new Vec3(1, 1, 1).normalize(),
  new Vec3(-1, -1, 1).normalize(),
  new Vec3(-1, 1, -1).normalize(),
  new Vec3(1, -1, -1).normalize(),
];
const TetrahedronSphereIndices = [0, 2, 1, 0, 3, 2, 0, 1, 3, 2, 3, 1];

// 正四面体表面细分获得球体
class TetrahedronSphere extends Object3D {
  radius: number;
  subdivisions: number;
  private initialVertices = TetrahedronSphereVertices;
  private initialIndices = TetrahedronSphereIndices;
  private cache: Map<string, number> = new Map();
  constructor(param: TetrahedronSphereParams) {
    const { radius = 1, subdivisions = 4, wireframe = false } = param;
    super();
    this.wireframe = wireframe;
    this.type = "sphere";
    this.radius = radius;
    this.scale.scale(radius); // 将单位球放大到指定半径
    this.subdivisions = Math.min(subdivisions, 10); // 最多细分10次
    this.subdivide();

    this.vertices = new Float32Array(
      this.initialVertices.reduce((res, point) => {
        res.push(point.x, point.y, point.z);
        return res;
      }, [] as number[])
    );
    this.indices = new Uint16Array(this.initialIndices);

    this.initializeObject(vertexShaderSource, fragmentShaderSource);
  }
  // 获取中点索引
  private getMidpointIndex(i1: number, i2: number) {
    const key = i1 > i2 ? `${i2}_${i1}` : `${i1}_${i2}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const pointA = this.initialVertices[i1];
    const pointB = this.initialVertices[i2];
    const middleV = new Vec3(
      (pointA.x + pointB.x) * 0.5,
      (pointA.y + pointB.y) * 0.5,
      (pointA.z + pointB.z) * 0.5
    );
    middleV.normalize();
    this.initialVertices.push(middleV);
    const idx = this.initialVertices.length - 1;
    this.cache.set(key, idx);
    return idx;
  }
  private subdivide() {
    for (let i = 0; i < this.subdivisions; i++) {
      const newIndices: number[] = [];
      for (let j = 0; j < this.initialIndices.length; j += 3) {
        const a = this.initialIndices[j];
        const b = this.initialIndices[j + 1];
        const c = this.initialIndices[j + 2];

        const ab = this.getMidpointIndex(a, b);
        const ac = this.getMidpointIndex(a, c);
        const bc = this.getMidpointIndex(b, c);
        newIndices.push(a, ab, ac, b, bc, ab, c, ac, bc, ab, bc, ac);
      }
      this.initialIndices = newIndices;
    }
  }
}

export default TetrahedronSphere;
