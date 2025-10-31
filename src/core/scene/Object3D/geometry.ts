import { generateFlatNormals } from "@core/gl/utils";

export function prepareNormalAttributes(params: {
  vertices: Float32Array;
  indices?: Uint16Array | Uint32Array;
  wireframe: boolean;
}): {
  vertices: Float32Array;
  normals?: Float32Array;
  indices?: Uint16Array | Uint32Array;
} {
  const { vertices, indices, wireframe } = params;
  if (wireframe) {
    return {
      vertices,
      normals: undefined,
      indices,
    };
  }
 const { vertices: vOut, normals } = generateFlatNormals(indices!, vertices);
    return { vertices: vOut, normals, indices: undefined };
}

export function buildWireframeIndices(
  indices?: Uint16Array | Uint32Array
): Uint16Array | Uint32Array | undefined {
  if (!indices) return undefined;
  const lineIndics: number[] = [];
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];
    lineIndics.push(a, b, b, c, a, c);
  }
  return indices instanceof Uint32Array
    ? new Uint32Array(lineIndics)
    : new Uint16Array(lineIndics);
}
