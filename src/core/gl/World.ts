import global from "@core/gl/global";
import Object3D from "@core/scene/Object3D";
import { Vec4 } from "@core/math/Vector";
import PerspectiveCamera from "@core/camera/Perspective";
import OrthographicCamera from "@core/camera/Orthographic";
import BlinnPhongLight from "@core/scene/Light";

interface WorldParams {
  clearColor?: Vec4;
  depthTest?: boolean;
  light: BlinnPhongLight;
}

class World {
  private children: Object3D[] = [];
  private canvas: HTMLCanvasElement;
  private pixelRatio: number;
  private isInitializedObjects = true;
  constructor(params: WorldParams) {
    const { clearColor = new Vec4(1, 1, 1, 1), light } = params;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.canvas = this.createCanvas();
    this.initWebgl2(clearColor);
    this.resize();
    global.light = light;
  }
  addObjects(...rest: Object3D[]) {
    this.children.push(...rest);
  }

  private initWebgl2(clearColor: Vec4) {
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
  private createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("style", `width:${window.innerWidth}px;height:${window.innerHeight}px`);
    canvas.width = window.innerWidth * this.pixelRatio;
    canvas.height = window.innerHeight * this.pixelRatio;
    document.body.appendChild(canvas);
    return canvas;
  }
  private resize() {
    window.addEventListener("resize", () => {
      // 更新像素比与画布尺寸
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      this.canvas.setAttribute("style", `width:${cssW}px;height:${cssH}px`);
      const w = cssW * this.pixelRatio;
      const h = cssH * this.pixelRatio;
      this.canvas.width = w;
      this.canvas.height = h;
      // 更新视口
      const gl = global.gl;
      gl.viewport(0, 0, w, h);
      // 更新相机投影，防止拉伸
      if (global.camera) {
        const camera = global.camera;
        const aspect = cssW / cssH;
        if (camera.type === "perspective") {
          (camera as PerspectiveCamera).aspect = aspect;
          (camera as PerspectiveCamera).updateProjectionMatrix();
        } else if (camera.type === "orthographic") {
          const oCam = camera as OrthographicCamera;
          const height = oCam.top - oCam.bottom;
          const width = height * aspect;
          const centerX = (oCam.left + oCam.right) / 2;
          oCam.left = centerX - width / 2;
          oCam.right = centerX + width / 2;
          oCam.updateProjectionMatrix();
        }
      }
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 同时清除两个缓冲区
    });
  }
  public render() {
    if (this.isInitializedObjects) {
      this.children.forEach((child: Object3D) => child.initializeObject());
      this.isInitializedObjects = false;
    }
    const gl = global.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.children.forEach((child: Object3D) => child.renderObject(this.isInitializedObjects));
    global.camera.viewMatrixDirty = false;
    global.camera.projectionMatrixDirty = false;
  }
}

export default World;
