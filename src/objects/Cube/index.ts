import Object3D from "@core/scene/Object3D";
import fragmentShaderSource from "./fragment.glsl";
import vertexShaderSource from "./vertex.glsl";

interface CubeParams {
  width: number;
  height: number;
  depth: number;
  wireframe?: boolean;
}

class Cube extends Object3D {
  constructor(params: CubeParams) {
    super("cube");
    const { width, height, depth, wireframe = false } = params;
    this.wireframe = wireframe;
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

    this.initial(vertexShaderSource, fragmentShaderSource);
  }
}

export default Cube;
