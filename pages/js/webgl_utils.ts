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

export const createAttributePosition = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  size: number,
  srcData: AllowSharedBufferSource,
) => {
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, size, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, srcData, gl.STATIC_DRAW);
};


export const createAttributeColor = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  srcData: AllowSharedBufferSource,
) => {
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  const colorBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, srcData, gl.STATIC_DRAW);
}

// uniform必须在gl.useProgram(program)之后
export const createUniformResolution = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
) => {
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
}
