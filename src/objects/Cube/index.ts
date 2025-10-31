import Object3D from "@core/scene/Object3D";

interface CubeParams {
  width: number;
  height: number;
  depth: number;
  wireframe?: boolean;
  instanceMatrices?: Float32Array;
  instanceCount?: number;
}

class Cube extends Object3D {
  constructor(params: CubeParams) {
    super();
    const { width, height, depth, wireframe = false, instanceMatrices, instanceCount } = params;
    this.wireframe = wireframe;
    this.type = "cube";
    this.normalMode = "flat";
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    this.indices = new Uint16Array([
      1, 0, 3,
      1, 3, 2,
      2, 3, 7,
      2, 7, 6,
      3, 0, 4,
      3, 4, 7,
      6, 5, 1,
      6, 1, 2,
      4, 5, 6,
      4, 6, 7,
      5, 4, 0,
      5, 0, 1,
    ]);
    this.vertices = new Float32Array([
      -w, -h, d, // 左下 前面
      -w, h, d, // 左上 前面
      w, h, d, // 右上 前面
      w, -h, d, // 右下 前面
      -w, -h, -d, // 左下 后面
      -w, h, -d, // 左上 后面
      w, h, -d, // 右上 后面
      w, -h, -d, // 右下 后面 
    ]);
    
    if (instanceMatrices && instanceCount && instanceCount > 0) {
      this.instanced = true;
      this.instanceMatrices = instanceMatrices;
      this.instanceCount = instanceCount;
    }
  }
}

export default Cube;
