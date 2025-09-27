import {
  createProgram,
  createShader,
  createProgramAttribute,
  vec2,
  add,
  mult,
  flatten,
  mix,
  vec3,
} from "../js/webgl_utils.ts";

import vertexShaderSource from "./vertex.glsl";
import fragmentShaderSource from "././fragment.glsl";
import { initWebGl2 } from "../js/webgl2.ts";

function sierpinski() {
  const positions: Vec2[] = [];
  const vertices = [vec2(0.0, 0.5), vec2(0.5, -0.5), vec2(-0.5, -0.5)];

  function divideTriangle(a: Vec2, b: Vec2, c: Vec2, count: number) {
    if (count === 0) {
      positions.push(a, b, c);
    } else {
      count--;
      const ab = mix(a, b, 0.5);
      const ac = mix(a, c, 0.5);
      const bc = mix(b, c, 0.5);

      divideTriangle(a, ab, ac, count);
      divideTriangle(ab, b, bc, count);
      divideTriangle(ac, bc, c, count);
    }
  }
  divideTriangle(vertices[0], vertices[1], vertices[2], 2);
  return positions;
}

function sierpinski3D() {
  const positions: Vec3[] = [];
  const colors: Vec3[] = [];

  const vertices = [
    vec3(0.0, 0.0, -1.0),
    vec3(0.0, 0.9428, 0.3333),
    vec3(-0.8165, -0.4714, 0.3333),
    vec3(0.8165, -0.4714, 0.3333),
  ];

  const baseColors = [
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0),
    vec3(0.0, 0.0, 0.0),
  ];

  function divideTriangle(a: Vec3, b: Vec3, c: Vec3, colorIndex: number) {
    positions.push(a, b, c);
    colors.push(baseColors[colorIndex], baseColors[colorIndex], baseColors[colorIndex]);
  }

  function divideTetra(
    a: Vec3,
    b: Vec3,
    c: Vec3,
    d: Vec3,
    count: number,
  ) {
    if (count === 0) {
      // 为每个三角形分配不同的颜色
      divideTriangle(a, b, c, 0);
      divideTriangle(a, c, d, 1);
      divideTriangle(a, b, d, 2);
      divideTriangle(b, c, d, 3);
    } else {
      count--;

      const ab = mix(a, b, 0.5);
      const ac = mix(a, c, 0.5);
      const bc = mix(b, c, 0.5);
      const ad = mix(a, d, 0.5);
      const bd = mix(b, d, 0.5);
      const cd = mix(c, d, 0.5);

      // 为每个子四面体分配不同的颜色
      divideTetra(a, ab, ac, ad, count);
      divideTetra(ab, b, bc, bd, count);
      divideTetra(ac, bc, c, cd, count);
      divideTetra(ad, bd, cd, d, count);
    }
  }

  // 减小递归深度，使用2而不是5
  divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], 2);

  return { positions, colors };
}

function sierpinski2() {
  const positions: Vec2[] = [];
  const num = 10000;
  const vertices = [vec2(0.0, 0.5), vec2(0.5, -0.5), vec2(-0.5, -0.5)];
  const ab = mix(vertices[0], vertices[1], 0.5);
  const ac = mix(vertices[0], vertices[2], 0.5);

  let p = mix(ab, ac, 0.5);
  positions.push(p);
  for (let i = 0; i < num-1; i++) {
    const j = Math.floor(Math.random() * 3);
    p = mix(vertices[j], p, 0.5);
    positions.push(p);
  }
  return positions;
}

const gl = initWebGl2();
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
const program = createProgram(gl, vertexShader, fragmentShader)!;

const { positions, colors } = sierpinski3D();
createProgramAttribute(gl, program, 3, flatten(positions), "aPosition", gl.FLOAT);
createProgramAttribute(gl, program, 3, flatten(colors), "aColor", gl.FLOAT);

gl.drawArrays(gl.TRIANGLES, 0, positions.length);
