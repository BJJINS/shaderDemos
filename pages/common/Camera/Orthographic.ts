import global from "../global";
import Camera from "./Camera";

class OrthographicCamera extends Camera {
  matrix: Float32Array;
  width: number;
  height: number;
  depth: number;
  constructor(width: number, height: number, depth: number) {
    super("orthographic");
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.matrix = this.projection();
    global.camera = this;
  }
  projection(){
    return new Float32Array([
        2 / this.width, 0,                0,              0,
        0,              -2 / this.height, 0,              0,
        0,              0,                2 / this.depth, 0,
        -1,             1,                1,              1,
    ]);
  }
}

export default OrthographicCamera;
