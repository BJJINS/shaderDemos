import { generateFlatNormals, generateSmoothNormals } from "@core/gl/utils";

export function prepareNormalAttributes(params: {
  vertices: Float32Array;
  indices?: Uint16Array;
  wireframe: boolean;
  normalMode: "smooth" | "flat";
}): {
  vertices: Float32Array;
  normals?: Float32Array;
  indices?: Uint16Array;
} {
  const { vertices, indices, wireframe, normalMode } = params;
  if (wireframe) {
    return {
      vertices,
      normals: undefined,
      indices,
    };
  }
  if (normalMode === "flat") {
    const { vertices: vOut, normals } = generateFlatNormals(indices!, vertices);
    return { vertices: vOut, normals, indices: undefined };
  } else {
    const normals = generateSmoothNormals(indices!, vertices!);
    return { vertices, normals, indices };
  }
}

export function buildWireframeIndices(indices?: Uint16Array): Uint16Array | undefined {
  if (!indices) return undefined;
  const lineIndics: number[] = [];
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];
    lineIndics.push(a, b, b, c, a, c);
  }
  return new Uint16Array(lineIndics);
}
