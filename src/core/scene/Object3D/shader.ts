import { createProgram, createShader } from "@core/gl/utils";
import { withDefaultObject3DProcessors } from "@core/shader/ShaderPipeline";

export function buildProgramWithPipeline(
  gl: WebGL2RenderingContext,
  params: {
    vertex: string;
    fragment: string;
    defines: Record<string, boolean>;
    normals?: Float32Array;
    material: { color: { x: number; y: number; z: number; w: number } };
  }
): WebGLProgram {
  const pipeline = withDefaultObject3DProcessors();
  const processed = pipeline.run(
    { vertex: params.vertex, fragment: params.fragment },
    { defines: params.defines, normals: params.normals, material: params.material }
  );

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, processed.vertex)!;
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, processed.fragment)!;
  return createProgram(gl, vertexShader, fragmentShader)!;
}

export function getUniformLocations(
  gl: WebGL2RenderingContext,
  program: WebGLProgram
): {
  viewMatrixUniformLoc: WebGLUniformLocation;
  projectionMatrixUniformLoc: WebGLUniformLocation;
  modelMatrixUniformLoc: WebGLUniformLocation;
} {
  const viewMatrixUniformLoc = gl.getUniformLocation(program, "uViewMatrix")!;
  const projectionMatrixUniformLoc = gl.getUniformLocation(program, "uProjectionMatrix")!;
  const modelMatrixUniformLoc = gl.getUniformLocation(program, "uModelMatrix")!;
  return { viewMatrixUniformLoc, projectionMatrixUniformLoc, modelMatrixUniformLoc };
}
