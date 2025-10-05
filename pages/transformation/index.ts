import {
  createProgram,
  createProgramAttribute,
  createShader,
  createUniformResolution,
  flatten,
  vec3,
  vec4,
} from "../js/webgl_utils.ts";

import { initWebGl2 } from "../js/webgl2.ts";
import fragmentShaderSource from "././fragment.glsl";
import vertexShaderSource from "./vertex.glsl";

const gl = initWebGl2();
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
const program = createProgram(gl, vertexShader, fragmentShader)!;


var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;
var theta = [0, 0, 0];
var flag = true;
var numElements = 36;

const vertices = [
    vec3(-0.5, -0.5,  0.5),
    vec3(-0.5,  0.5,  0.5),
    vec3(0.5,  0.5,  0.5),
    vec3(0.5, -0.5,  0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5,  0.5, -0.5),
    vec3(0.5,  0.5, -0.5),
    vec3(0.5, -0.5, -0.5)
];

const vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(1.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

const indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
];

const iBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

createProgramAttribute(gl, program, 4, flatten(vertexColors), "aColor", gl.FLOAT);
createProgramAttribute(gl, program, 3, flatten(vertices), "aPosition", gl.FLOAT);

const thetaLoc = gl.getUniformLocation(program, "uTheta");


gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_BYTE, 0);

    document.getElementById( "xButton" )!.onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" )!.onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" )!.onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT")!.onclick = function(){flag = !flag;};

function render() {
    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(render);
}

render();