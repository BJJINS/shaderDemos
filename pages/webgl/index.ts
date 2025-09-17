import { initWebGl2 } from "../js/webgl2";
import {
  createProgramAttribute,
  createProgram,
  createShader,
  createUniformResolution,
  createUniformTexture,
} from "./../js/webgl_utils";
import vertexShaderSource from "./vertexShader.glsl";
import fragmentShaderSource from "./fragmentShader.glsl";
import { loadImage } from "../js/utils";

const gl = initWebGl2();

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
)!;

const program = createProgram(gl, vertexShader, fragmentShader)!;

createProgramAttribute(
  gl,
  program,
  2,
  new Float32Array([
    200, 900, 500, 900, 500, 1200, 200, 900, 500, 1200, 200, 1200,
  ]),
  "a_position",
  gl.FLOAT
);

loadImage("/assets/pastleo.jpg").then((image) => {
  createProgramAttribute(
    gl,
    program,
    2,
    new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
    "a_texcoord",
    gl.FLOAT
  );
  gl.useProgram(program);
  createUniformResolution(gl, program);
  createUniformTexture(gl, program, image, "u_texture");

  gl.drawArrays(gl.TRIANGLES, 0, 6);
});
