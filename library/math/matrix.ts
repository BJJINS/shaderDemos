interface Mat3x3 {
  content: [number, number, number, number, number, number, number, number, number];
  type: "mat3x3";
}

export interface Mat4x4 {
  content: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  type: "mat4x4";
}

const identity = (type: "mat3" | "mat4") => {
  if (type === "mat3") {
    return {
      content: [1, 0, 0, 0, 1, 0, 0, 0, 1],
      type: "mat3",
    };
  }
  return {
    content: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    type: "mat4",
  };
};

export const mat3x3 = (arr?: Mat3x3["content"]): Mat3x3 => {
  if (arr) {
    return {
      content: arr,
      type: "mat3x3",
    };
  }
  return identity("mat3") as Mat3x3;
};

export const mat4x4 = (arr?: Mat4x4["content"]): Mat4x4 => {
  if (arr) {
    return {
      content: arr,
      type: "mat4x4",
    };
  }
  return identity("mat4") as Mat4x4;
};

const isMat4x4 = (m: Mat3x3 | Mat4x4): m is Mat4x4 => {
  return m.type === "mat4x4";
};

const transpose = (m: Mat3x3 | Mat4x4) => {
  if (isMat4x4(m)) {
    const { content } = m;
    m.content = [
      content[0],
      content[4],
      content[8],
      content[12],
      content[1],
      content[5],
      content[9],
      content[13],
      content[2],
      content[6],
      content[10],
      content[14],
      content[3],
      content[7],
      content[11],
      content[15],
    ];
  } else {
    const { content } = m;
    m.content = [
      content[0],
      content[3],
      content[6],
      content[1],
      content[4],
      content[7],
      content[2],
      content[5],
      content[8],
    ];
  }
  return m;
};

const clone = (m: Mat3x3 | Mat4x4) => {
  if (isMat4x4(m)) {
    return mat4x4([...m.content]);
  }
  return mat3x3([...m.content]);
};

const mult = (ma: Mat3x3 | Mat4x4, mb: Mat3x3 | Mat4x4) => {
  if (isMat4x4(ma) && isMat4x4(mb)) {
    const { content: m1 } = ma;
    const { content: m2 } = mb;
    ma.content = [
      m1[0] * m2[0] + m1[1] * m2[4] + m1[2] * m2[8] + m1[3] * m2[12],
      m1[0] * m2[1] + m1[1] * m2[5] + m1[2] * m2[9] + m1[3] * m2[13],
      m1[0] * m2[2] + m1[1] * m2[6] + m1[2] * m2[10] + m1[3] * m2[14],
      m1[0] * m2[3] + m1[1] * m2[7] + m1[2] * m2[11] + m1[3] * m2[15],

      m1[4] * m2[0] + m1[5] * m2[4] + m1[6] * m2[8] + m1[7] * m2[12],
      m1[4] * m2[1] + m1[5] * m2[5] + m1[6] * m2[9] + m1[7] * m2[13],
      m1[4] * m2[2] + m1[5] * m2[6] + m1[6] * m2[10] + m1[7] * m2[14],
      m1[4] * m2[3] + m1[5] * m2[7] + m1[6] * m2[11] + m1[7] * m2[15],

      m1[8] * m2[0] + m1[9] * m2[4] + m1[10] * m2[8] + m1[11] * m2[12],
      m1[8] * m2[1] + m1[9] * m2[5] + m1[10] * m2[9] + m1[11] * m2[13],
      m1[8] * m2[2] + m1[9] * m2[6] + m1[10] * m2[10] + m1[11] * m2[14],
      m1[8] * m2[3] + m1[9] * m2[7] + m1[10] * m2[11] + m1[11] * m2[15],

      m1[12] * m2[0] + m1[13] * m2[4] + m1[14] * m2[8] + m1[15] * m2[12],
      m1[12] * m2[1] + m1[13] * m2[5] + m1[14] * m2[9] + m1[15] * m2[13],
      m1[12] * m2[2] + m1[13] * m2[6] + m1[14] * m2[10] + m1[15] * m2[14],
      m1[12] * m2[3] + m1[13] * m2[7] + m1[14] * m2[11] + m1[15] * m2[15],
    ];
  } else {
    const { content: m1 } = ma;
    const { content: m2 } = mb;
    ma.content = [
      m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6],
      m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7],
      m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8],

      m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6],
      m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7],
      m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8],

      m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6],
      m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7],
      m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8],
    ];
  }
  return ma;
};

const toArray = (m: Mat3x3 | Mat4x4) => {
  return m.content;
};

export const Mat = {
  identity,
  transpose,
  clone,
  mult,
  toArray
};
