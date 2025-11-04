interface InitCanvasOptions {
  element?: HTMLCanvasElement | string;
}

const isCanvas = (canvas: any) => {
  return canvas?.tagName && canvas.tagName.toLowerCase() === "canvas";
};

const initCanvas = (options: InitCanvasOptions) => {
  const { element } = options;
  let canvas: HTMLCanvasElement;
  if (typeof element === "string") {
    canvas = document.querySelector(element) as HTMLCanvasElement;
  } else if (isCanvas(element)) {
    canvas = element!;
  } else {
    canvas = document.createElement("canvas");
  }
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.setAttribute("style", `width:${window.innerWidth}px;height:${window.innerHeight}px`);
  document.body.appendChild(canvas);
  return canvas;
};

interface CreateWebgl2Options {
  canvas: HTMLCanvasElement;
  antialias?: boolean;
  clearColor?: [number, number, number, number];
}
const createWebgl2 = (options: CreateWebgl2Options) => {
  const { canvas, antialias = true, clearColor = [1, 1, 1, 1] } = options;
  const gl = canvas.getContext("webgl2", {
    antialias,
  })!;
  gl.enable(gl.DEPTH_TEST); // 开启深度测试
  gl.enable(gl.CULL_FACE); // 开启面剔除
  gl.cullFace(gl.BACK); // 剔除背面
  gl.frontFace(gl.CCW); // 设置逆时针(CCW)为正面, 顺时针(CW)为反面，默认是CCW
  gl.clearColor(...clearColor);
  gl.viewport(0, 0, canvas.width, canvas.height);
  return gl;
};

const webgl2Resize = (gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) => {
  window.addEventListener("resize", () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 同时清除两个缓冲区
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const w = cssW * pixelRatio;
    const h = cssH * pixelRatio;
    canvas.width = w;
    canvas.height = h;
    canvas.setAttribute("style", `width:${cssW}px;height:${cssH}px`);
    gl.viewport(0, 0, w, h);
  });
};

const initializeWebgl2 = (options: Partial<CreateWebgl2Options>) => {
  const canvas = initCanvas({
    element: options?.canvas,
  });
  const gl = createWebgl2({
    ...options,
    canvas,
  });
  webgl2Resize(gl, canvas);
  return {
    gl,
    canvas,
  };
};
