import { Vec4 } from "./Vector";

interface WorldParams {
  clearColor?: Vec4;
  depthTest?: boolean;
  cullFace?: boolean;
}

class World {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  pixelRatio: number;
  constructor(params?: WorldParams) {
    const { clearColor = new Vec4(1, 1, 1, 1), depthTest = true, cullFace = true } = params || {};
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.canvas = this.createCanvas();
    this.gl = this.initWebgl2(clearColor, depthTest, cullFace);
    this.resize();
  }
  initWebgl2(clearColor: Vec4, depthTest: boolean = true, cullFace: boolean = true) {
    const gl = this.canvas.getContext("webgl2", {
      antialias: this.pixelRatio < 2,
    })!;
    if (depthTest) {
      gl.enable(gl.DEPTH_TEST); // 开启深度测试
    }
    if (cullFace) {
      gl.enable(gl.CULL_FACE); // 开启面剔除
    }
    gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
  }
  createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("style", `width:${window.innerWidth}px;height:${window.innerHeight}px`);
    canvas.width = window.innerWidth * this.pixelRatio;
    canvas.height = window.innerHeight * this.pixelRatio;
    document.body.appendChild(canvas);
    return canvas;
  }

  resize() {
    window.addEventListener("resize", () => {
      this.gl.canvas.width = window.innerWidth * this.pixelRatio;
      this.gl.canvas.height = window.innerHeight * this.pixelRatio;
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    });
  }
}

export default World;
