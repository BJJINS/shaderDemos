import { initWebGl2 } from "../js/webgl2";
import {  createAttributePosition, createProgram, createShader, createUniformResolution } from "./../js/webgl_utils";

const gl = initWebGl2();

const vertexShaderSource =`#version 300 es
  in vec2 a_position;
  in vec3 a_color;

  uniform vec2 u_resolution;

  out vec3 v_color;

  void main() {
    v_color = a_color;
    gl_Position = vec4(a_position / u_resolution * vec2(2, -2) + vec2(-1, 1), 0, 1);
  }
`;
const fragmentShaderSource = `#version 300 es
  precision mediump float;
  in vec3 v_color;
  out vec4 outColor;
  void main() {
    outColor = vec4(v_color, 1);
  }
`;

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
