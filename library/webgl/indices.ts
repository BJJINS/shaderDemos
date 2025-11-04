const createIndexBuffer = (
  gl: WebGL2RenderingContext,
  indices: Uint16Array | Uint32Array
) => {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return buffer;
};

export default createIndexBuffer;