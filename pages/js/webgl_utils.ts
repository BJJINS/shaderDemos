export const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (ok) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

export const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program); // 连结 shader
  const ok = gl.getProgramParameter(program, gl.LINK_STATUS); // 检查是否成功连结 shader
  if (ok) {
    gl.useProgram(program);
    return program;
  }
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

export const createProgramAttribute = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  size: number,
  srcData: AllowSharedBufferSource,
  name: string,
  type: number
) => {
  const attributeLocation = gl.getAttribLocation(program, name);
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // 先写入数据，再设置顶点属性指针
  gl.bufferData(gl.ARRAY_BUFFER, srcData, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributeLocation);
  gl.vertexAttribPointer(attributeLocation, size, type, false, 0, 0);
};

// uniform必须在gl.useProgram(program)之后
export const createUniformResolution = (gl: WebGL2RenderingContext, program: WebGLProgram) => {
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
};

let textUnit = 0;
export const createUniformTexture = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  source: TexImageSource,
  name: string
) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
  gl.generateMipmap(gl.TEXTURE_2D);
  const location = gl.getUniformLocation(program, name);
  gl.activeTexture(gl.TEXTURE0 + textUnit);
  gl.uniform1i(location, textUnit);
  textUnit++;
};

export function vec2(x?: number, y?: number): Vec2 {
  return {
    x: x || 0,
    y: y || 0,
    type: "vec2",
  };
}

export function vec3(x?: number, y?: number, z?: number): Vec3 {
  return {
    x: x || 0,
    y: y || 0,
    z: z || 0,
    type: "vec3",
  };
}

export function vec4(x?: number, y?: number, z?: number, w?: number): Vec4 {
  return {
    x: x || 0,
    y: y || 0,
    z: z || 0,
    w: w || 1,
    type: "vec4",
  };
}

export function add(a: Vec2, b: Vec2): Vec2;
export function add(a: Vec3, b: Vec3): Vec3;
export function add(a: Vec2 | Vec3, b: Vec2 | Vec3) {
  if (a.type === "vec2" && b.type === "vec2") {
    return vec2(a.x + b.x, a.y + b.y);
  }
  if (a.type === "vec3" && b.type === "vec3") {
    return vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }
}

export function mult(num: number, a: Vec2): Vec2;
export function mult(num: number, a: Vec3): Vec3;
export function mult(num: number, a: Vec2 | Vec3) {
  if (a.type === "vec2") {
    return vec2(num * a.x, num * a.y);
  }
  if (a.type === "vec3") {
    return vec3(num * a.x, num * a.y, num * a.z);
  }
}

function isVec3(v: Vec2 | Vec3 | Vec4): v is Vec3 {
  return v.type === "vec3";
}
function isVec4(v: Vec2 | Vec3 | Vec4): v is Vec4 {
  return v.type === "vec4";
}
// 将Vec2|Vec3[] 改成 Float32Array
export function flatten(arr: Vec2[]): Float32Array;
export function flatten(arr: Vec3[]): Float32Array;
export function flatten(arr: Vec4[]): Float32Array;
export function flatten(arr: Vec2[] | Vec3[] | Vec4[]): Float32Array {
  const lenMap = {
    vec2: 2,
    vec3: 3,
    vec4: 4,
  };
  const len = lenMap[arr[0].type];
  const res = new Float32Array(len * arr.length);
  return arr.reduce((res, item, index) => {
    if (isVec4(item)) {
      const i = index * 4;
      res[i] = item.x;
      res[i + 1] = item.y;
      res[i + 2] = item.z;
      res[i + 3] = item.w;
    } else if (isVec3(item)) {
      const i = index * 3;
      res[i] = item.x;
      res[i + 1] = item.y;
      res[i + 2] = item.z;
    } else {
      const i = index * 2;
      res[i] = item.x;
      res[i + 1] = item.y;
    }
    return res;
  }, res);
}

export function mix(a: Vec2, b: Vec2, num: number): Vec2;
export function mix(a: Vec3, b: Vec3, num: number): Vec3;
export function mix(a: Vec2 | Vec3, b: Vec2 | Vec3, num: number): Vec2 | Vec3 {
  function mixImpl(a: number, b: number) {
    return num * a + (1 - num) * b;
  }

  if (a.type === "vec2" && b.type === "vec2") {
    return vec2(mixImpl(a.x, b.x), mixImpl(a.y, b.y));
  }

  if (a.type === "vec3" && b.type === "vec3") {
    return vec3(mixImpl(a.x, b.x), mixImpl(a.y, b.y), mixImpl(a.z, b.z));
  }
  throw new Error("a and b must be the same vector type");
}
