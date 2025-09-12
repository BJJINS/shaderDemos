const translate = (
  matrix: Matrix4,
  offset: number,
  tx: number,
  ty: number,
  tz: number
) => {
  for (let i = 0; i < 4; i++) {
    const mi = offset + i;
    matrix[12 + mi] +=
      matrix[mi] * tx + matrix[4 + mi] * ty + matrix[8 + mi] * tz;
  }
};

export const setIdentityM = (matrix: Matrix4, n = 0) => {
  for (let i = 0; i < 16; i++) {
    matrix[i] = n;
  }
  matrix[0] = 1;
  matrix[5] = 1;
  matrix[10] = 1;
  matrix[15] = 1;
};

const length = (vector: Vector3) => {
  return Math.sqrt(
    vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
  );
};

const normalize = (vector: Vector3) => {
  const len = length(vector);
  return {
    x: vector.x / len,
    y: vector.y / len,
    z: vector.z / len,
  };
};

const cross = (a: Vector3, b: Vector3) => {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
};
// 创建视图矩阵（View Matrix）
export const setLookAtM = (
  matrix: Matrix4,
  offset: number,
  position: Vector3,
  target: Vector3,
  _up: Vector3 = { x: 0, y: 1, z: 0 }
) => {
  // 计算相机视线的方向
  const dir = {
    x: target.x - position.x,
    y: target.y - position.y,
    z: target.z - position.z,
  };
  const font = normalize(dir);
  const right = normalize(cross(font, _up));
  const up = normalize(cross(right, font));
  matrix[offset + 0] = right.x;
  matrix[offset + 1] = up.x;
  matrix[offset + 2] = -font.x;
  matrix[offset + 3] = 0.0;
  matrix[offset + 4] = right.y;
  matrix[offset + 5] = up.y;
  matrix[offset + 6] = -font.y;
  matrix[offset + 7] = 0.0;
  matrix[offset + 8] = right.z;
  matrix[offset + 9] = up.z;
  matrix[offset + 10] = -font.z;
  matrix[offset + 11] = 0.0;
  matrix[offset + 12] = 0.0;
  matrix[offset + 13] = 0.0;
  matrix[offset + 14] = 0.0;
  matrix[offset + 15] = 1.0;
  translate(matrix, offset, -position.x, -position.y, -position.z);
};
