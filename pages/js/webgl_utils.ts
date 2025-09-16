export const createShader = (
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string
) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (ok) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

export const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program); // 连结 shader
  const ok = gl.getProgramParameter(program, gl.LINK_STATUS); // 检查是否成功连结 shader
  if (ok) {
    return program;
  }
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

export const initWebGl2 = () => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("style", "position:fixed;top:0;left:0;");
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  const gl = canvas.getContext("webgl2", {
    antialias: window.devicePixelRatio < 2,
  })!;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(108 / 255, 225 / 255, 153 / 255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  document.body.appendChild(canvas);
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
  });
  return gl;
};
