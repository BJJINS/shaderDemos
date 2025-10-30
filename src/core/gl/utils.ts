import { Vec3 } from "@core/math/Vector";

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
  if (attributeLocation === -1) return;
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // 先写入数据，再设置顶点属性指针
  gl.bufferData(gl.ARRAY_BUFFER, srcData, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributeLocation);
  gl.vertexAttribPointer(attributeLocation, size, type, false, 0, 0);
};

// Bind a mat4 as an instanced attribute (occupies 4 consecutive attribute locations)
export const createInstancedMat4Attribute = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  data: Float32Array
) => {
  const baseLocation = gl.getAttribLocation(program, name);
  if (baseLocation === -1) return;
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  const bytesPerMatrix = 16 * 4; // 16 floats per mat4
  const stride = bytesPerMatrix;
  for (let i = 0; i < 4; i++) {
    const loc = baseLocation + i;
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, stride, i * 16);
    gl.vertexAttribDivisor(loc, 1);
  }
  return buffer;
};

export const degreesToRadians = (degrees: number) => {
  return (degrees / 180) * Math.PI;
};

export const createIndexBuffer = (gl: WebGL2RenderingContext, indices: Uint16Array) => {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return buffer;
};

export const generateFlatNormals = (originIndices: Uint16Array, originVertices: Float32Array) => {
  const normals: number[] = [];
  const vertices: number[] = [];
  for (let i = 0; i < originIndices.length; i += 3) {
    const ia = originIndices[i];
    const ib = originIndices[i + 1];  
    const ic = originIndices[i + 2];

    const a = new Vec3(originVertices[ia * 3], originVertices[ia * 3 + 1], originVertices[ia * 3 + 2]);
    const b = new Vec3(originVertices[ib * 3], originVertices[ib * 3 + 1], originVertices[ib * 3 + 2]);
    const c = new Vec3(originVertices[ic * 3], originVertices[ic * 3 + 1], originVertices[ic * 3 + 2]);

    const ba = b.clone().sub(a);
    const ca = c.clone().sub(a);
    const normal = ba.cross(ca).normalize();

    vertices.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    normals.push(
      normal.x,
      normal.y,
      normal.z,
      normal.x,
      normal.y,
      normal.z,
      normal.x,
      normal.y,
      normal.z
    );
  }
  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
  };
};


export const generateSmoothNormals = (originIndices: Uint16Array, originVertices: Float32Array) => {
      const normals = new Float32Array(originVertices.length);
    for (let i = 0; i < originIndices.length; i += 3) {
      const i3 = i * 3;
      const ia = originIndices[i3]; 
      const ib = originIndices[i3 + 1];
      const ic = originIndices[i3 + 2];
      const a = new Vec3(originVertices[ia], originVertices[ia + 1], originVertices[ia + 2]);
      const b = new Vec3(originVertices[ib], originVertices[ib + 1], originVertices[ib + 2]);
      const c = new Vec3(originVertices[ic], originVertices[ic + 1], originVertices[ic + 2]);

      const ba = b.clone().sub(a);
      const ca = c.clone().sub(a);
      const normal = ba.cross(ca).normalize();

      normals[ia] = normal.x;
      normals[ia + 1] = normal.y;
      normals[ia + 2] = normal.z;

      normals[ib] = normal.x;
      normals[ib + 1] = normal.y;
      normals[ib + 2] = normal.z;

      normals[ic] = normal.x;
      normals[ic + 1] = normal.y;
      normals[ic + 2] = normal.z;
    }
    return normals;
}
