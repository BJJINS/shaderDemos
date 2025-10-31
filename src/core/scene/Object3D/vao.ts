import {
  createIndexBuffer,
  createInstancedMat4Attribute,
  createProgramAttribute,
} from "@core/gl/utils";
import { buildWireframeIndices } from "./geometry";

export function createObjectVAO(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  params: {
    vertices: Float32Array;
    normals?: Float32Array;
    indices?: Uint16Array | Uint32Array;
    wireframe: boolean;
    instanced: boolean;
    instanceMatrices?: Float32Array;
  }
) {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  createProgramAttribute(gl, program, 3, params.vertices, "aPosition", gl.FLOAT);
  if (params.normals && params.normals.length > 0) {
    createProgramAttribute(gl, program, 3, params.normals, "aNormal", gl.FLOAT);
  }

  let lineIndics: Uint16Array | Uint32Array | undefined;
  if (params.wireframe && params.indices) {
    lineIndics = buildWireframeIndices(params.indices);
    if (lineIndics) createIndexBuffer(gl, lineIndics);
  } else if (!params.wireframe && params.indices) {
    createIndexBuffer(gl, params.indices);
  }

  let instanceBuffer: WebGLBuffer | undefined;
  if (params.instanced && params.instanceMatrices) {
    instanceBuffer = createInstancedMat4Attribute(
      gl,
      program,
      "aInstanceMatrix",
      params.instanceMatrices
    );
  }

  gl.bindVertexArray(null);
  return { vao, lineIndics, instanceBuffer };
}

export function updateInstanceBuffer(
  gl: WebGL2RenderingContext,
  vao: WebGLVertexArrayObject,
  buffer: WebGLBuffer,
  mats: Float32Array
) {
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, mats, gl.DYNAMIC_DRAW);
  gl.bindVertexArray(null);
}
