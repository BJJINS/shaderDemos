interface Vec3 {
  x: number;
  y: number;
  z: number;
  type: "vec3";
}

interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
  type: "vec4";
}

interface Geometry {
  positions: Float32Array;
  normals?: Float32Array;
  indices?: Uint16Array | Uint32Array;
}

interface Material {
  color: Vec3;
  shininess?: number;
  wireframe?: boolean;
}
