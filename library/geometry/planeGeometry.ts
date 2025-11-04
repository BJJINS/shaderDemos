interface PlaneGeometryOptions {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}
const planeGeometry = (options?: PlaneGeometryOptions) => {
  const { width = 1, height = 1, widthSegments = 1, heightSegments = 1 } = options || {};
  const vertexCount = (widthSegments + 1) * (heightSegments + 1);
  const indicesCount = widthSegments * heightSegments * 6;
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const indices =
    indicesCount > 65535 ? new Uint32Array(indicesCount) : new Uint16Array(indicesCount);

  const w = width / widthSegments;
  const h = height / heightSegments;

  const halfW = width / 2;
  const halfH = height / 2;

  let k = 0;
  for (let i = 0; i <= heightSegments; i++) {
    for (let j = 0; j <= widthSegments; j++) {
      const x = j * w - halfW;
      const y = i * h - halfH;
      positions[k] = x;
      positions[k + 1] = y;
      positions[k + 2] = 0;
      normals[k] = 0;
      normals[k + 1] = 0;
      normals[k + 2] = 1;
      k += 3;
    }
  }

  k = 0;
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = i + (widthSegments + 1) * j;
      const b = a + 1;
      const c = a + widthSegments + 1;
      const d = c + 1;
      indices[k++] = a;
      indices[k++] = b;
      indices[k++] = c;
      indices[k++] = c;
      indices[k++] = b;
      indices[k++] = d;
    }
  }
  return {
    positions,
    normals,
    indices,
  }
};

export default planeGeometry;