import global from "./global";
import { Vec4 } from "./Vector";

interface WorldParams {
  clearColor?: Vec4;
  depthTest?: boolean;
}

class World {
  canvas: HTMLCanvasElement;
  pixelRatio: number;
  constructor(params?: WorldParams) {
    const { clearColor = new Vec4(1, 1, 1, 1), depthTest = true } = params || {};
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.canvas = this.createCanvas();
    this.initWebgl2(clearColor, depthTest);
    this.resize();
  }
  initWebgl2(clearColor: Vec4, depthTest: boolean = true) {
    const gl = this.canvas.getContext("webgl2", {
      antialias: this.pixelRatio < 2,
    })!;
    if (depthTest) {
      gl.enable(gl.DEPTH_TEST); // 开启深度测试
    }
    gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 同时清除颜色和深度缓冲区
    global.gl = gl;
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
      this.canvas.setAttribute(
        "style",
        `width:${window.innerWidth}px;height:${window.innerHeight}px`
      );
      const w = window.innerWidth * this.pixelRatio;
      const h = window.innerHeight * this.pixelRatio;
      this.canvas.width = w;
      this.canvas.height = h;
      if (global.gl) {
        global.gl.viewport(0, 0, w, h);
        global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT); // 同时清除两个缓冲区
      }
    });
  }
}

export default World;
