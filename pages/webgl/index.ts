import { createProgram, createShader, initWebGl2 } from "./../js/webgl_utils";

const gl = initWebGl2();

const vertexShaderSource = `#version 300 es
  in vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
`;
const fragmentShaderSource = `#version 300 es
  precision mediump float;
  out vec4 outColor;
  void main() {
    outColor = vec4(0.4745, 0.3333, 0.2823, 1);
  }
`;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
)!;
const program = createProgram(gl, vertexShader, fragmentShader);
