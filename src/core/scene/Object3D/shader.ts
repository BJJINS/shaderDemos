import { createProgram, createShader } from "@core/gl/utils";
import { withDefaultObject3DProcessors } from "@core/shader/ShaderPipeline";

export function buildProgramWithPipeline(
  gl: WebGL2RenderingContext,
  params: {
    vertex: string;
    fragment: string;
    defines: Record<string, boolean>;
  }
): WebGLProgram {
  const { vertex, fragment, defines } = params;
  const pipeline = withDefaultObject3DProcessors();
  const processed = pipeline.run({ vertex, fragment }, { defines });
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, processed.vertex)!;
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, processed.fragment)!;
  return createProgram(gl, vertexShader, fragmentShader)!;
}

export function buildWireframeProgramWithPipeline(
  gl: WebGL2RenderingContext,
  params: {
    vertex: string;
    fragment: string;
    defines: Record<string, boolean>;
  }
): WebGLProgram {
  const { vertex, fragment, defines } = params;
  const keys = Object.keys(defines);
  let str = "";
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof typeof defines;
    if (defines[key]) {
      str += `#define ${String(key).toUpperCase()}\n`;
    }
  }
  const processedVertex = vertex.replace("{ { defines } }", str);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, processedVertex)!;
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)!;
  return createProgram(gl, vertexShader, fragmentShader)!;
}

