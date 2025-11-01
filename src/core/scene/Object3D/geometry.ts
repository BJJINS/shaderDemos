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
