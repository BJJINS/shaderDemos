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
    const { clearColor = new Vec4(1, 1, 1, 1)} = params || {};
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.canvas = this.createCanvas();
    this.initWebgl2(clearColor);
    this.resize();
  }
  initWebgl2(clearColor: Vec4) {
    const gl = this.canvas.getContext("webgl2", {
      antialias: this.pixelRatio < 2,
    })!;
    gl.enable(gl.DEPTH_TEST); // 开启深度测试
    gl.enable(gl.CULL_FACE); // 开启面剔除
    gl.cullFace(gl.BACK); // 剔除背面
    gl.frontFace(gl.CCW); // 设置逆时针(CCW)为正面, 顺时针(CW)为反面，默认是CCW
    gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
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
