import { initWebGl2 } from "../js/webgl2.js";
import {
  createProgram,
  createShader,
  createProgramAttribute,
  vec2,
  add,
  mult,
  flatten,
} from "../js/webgl_utils.ts";

import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "././fragment.glsl";

function sierpinski() {
  const num = 5000;
  const positions = [];
  const vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)];
  const u = add(vertices[0], vertices[1]);
  const v = add(vertices[0], vertices[2]);
  let p = mult(0.5, add(u, v));
  positions.push(p);
  for (let i = 0; i < num - 1; i++) {
    const index = Math.floor(Math.random() * 3);
    const point = vertices[index];
    p = mult(0.5, add(p, point));
    positions.push(p);
  }
  return positions;
}

const positions = sierpinski();

const gl = initWebGl2();

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
const program = createProgram(gl, vertexShader, fragmentShader)!;

createProgramAttribute(gl, program, 2, flatten(positions), "aPosition", gl.FLOAT);

gl.drawArrays(gl.POINTS, 0, positions.length);
