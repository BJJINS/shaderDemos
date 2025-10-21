export const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
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

export const createProgramAttribute = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  size: number,
  srcData: AllowSharedBufferSource,
  name: string,
  type: number
) => {
  const attributeLocation = gl.getAttribLocation(program, name);
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // 先写入数据，再设置顶点属性指针
  gl.bufferData(gl.ARRAY_BUFFER, srcData, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributeLocation);
  gl.vertexAttribPointer(attributeLocation, size, type, false, 0, 0);
};

export const degreesToRadians = (degrees: number) => {
  return degrees / 180 * Math.PI;
};
