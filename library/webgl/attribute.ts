const createAttribute = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  size: number,
  srcData: AllowSharedBufferSource,
  name: string,
  type: number,
  stride = 0,
  offset = 0
) => {
  const attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) return;
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, srcData, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributeLocation);
  gl.vertexAttribPointer(attributeLocation, size, type, false, stride, offset);
};


export default createAttribute;