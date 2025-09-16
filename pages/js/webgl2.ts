const resize = (gl: WebGL2RenderingContext) => {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  gl.canvas.width = window.innerWidth * pixelRatio;
  gl.canvas.height = window.innerHeight * pixelRatio;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

export const initWebGl2 = () => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute(
    "style",
    "position:fixed;top:0;left:0;width:100%;height:100%;"
  );
  const gl = canvas.getContext("webgl2", {
    antialias: window.devicePixelRatio < 2,
  })!;
  gl.clearColor(1, 1, 1, 1);
  resize(gl);
  document.body.appendChild(canvas);
  window.addEventListener("resize", () => resize(gl));
  return gl;
};
