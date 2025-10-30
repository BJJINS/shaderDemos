import type Camera from "@core/camera/Camera";

class GlobalContext {
  private static instance: GlobalContext;
  private _gl: WebGL2RenderingContext | null = null;
  private _camera: Camera | null = null;

  constructor() {}

  static getInstance(): GlobalContext {
    if (!GlobalContext.instance) {
      GlobalContext.instance = new GlobalContext();
    }
    return GlobalContext.instance;
  }

  set gl(gl: WebGL2RenderingContext) {
    this._gl = gl;
  }

  get gl(): WebGL2RenderingContext {
    if (!this._gl) {
      throw new Error("webgl2 not initialized");
    }
    return this._gl;
  }

  set camera(camera: Camera) {
    this._camera = camera;
  }

  get camera(): Camera {
    if (!this._camera) {
      throw new Error("camera not initialized");
    }
    return this._camera;
  }
}

export default GlobalContext.getInstance();
