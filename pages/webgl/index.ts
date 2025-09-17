import { initWebGl2 } from "../js/webgl2";
import {  createAttributePosition, createProgram, createShader, createUniformResolution } from "./../js/webgl_utils";
import vertexShaderSource from "./vertexShader.glsl";
import fragmentShaderSource from "./fragmentShader.glsl";

const gl = initWebGl2();

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
)!;

const program = createProgram(gl, vertexShader, fragmentShader)!;

createAttributePosition(gl, program, 2, new Float32Array([
    500,900,
    200,900,
    500,1200,
  
    500,1200,
    200,900,
    200,1200,
  ]));


gl.useProgram(program);
createUniformResolution(gl, program);
gl.drawArrays(gl.TRIANGLES, 0, 6);
