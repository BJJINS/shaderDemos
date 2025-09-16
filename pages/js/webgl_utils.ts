export const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (ok) {
    return shader
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};


export const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program); // 连结 shader
  const ok = gl.getProgramParameter(program, gl.LINK_STATUS); // 检查是否成功连结 shader
  if (ok) {
    return program
  }
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};