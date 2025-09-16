import { initWebGl2 } from "../js/webgl2";
import { createAttributeColor, createAttributePosition, createProgram, createShader, createUniformResolution } from "./../js/webgl_utils";

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
    150,60,
    180,82.5,
    120,82.5,

    100,60,
    80,40,
    120,40
  ]));


  createAttributeColor(gl, program, new Uint8Array([
    121,85,72,
    121,85,72,
    121,85,72,

    0,0,0,
    255,255,255,
    255,255,255,
  ]));


gl.useProgram(program);
createUniformResolution(gl, program);
gl.drawArrays(gl.TRIANGLES, 0, 6);
