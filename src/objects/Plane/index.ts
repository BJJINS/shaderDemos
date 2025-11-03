import Object3D from "@core/scene/Object3D";

interface Params {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
  wireframe?: boolean;
}

class Plane extends Object3D {
  constructor(params?: Params) {
    super();
    this.type = "Plane";
    const {
      width = 1,
      height = 1,
      widthSegments = 1,
      heightSegments = 1,
      wireframe = false,
    } = params || {};

    this.wireframe = wireframe;

    const halfW = width * 0.5;
    const halfH = height * 0.5;

    const vertexCount = (widthSegments + 1) * (heightSegments + 1);
    const indexCount = widthSegments * heightSegments * 6;
    this.vertices = new Float32Array(vertexCount * 3);
    this.indices = indexCount > 65535 ? new Uint32Array(indexCount) : new Uint16Array(indexCount);

    let k = 0;
    for (let iy = 0; iy <= heightSegments; iy++) {
      for (let ix = 0; ix <= widthSegments; ix++) {
        const x = (ix / widthSegments) * width - halfW;
        const y = (iy / heightSegments) * height - halfH;
        this.vertices[k++] = x;
        this.vertices[k++] = y;
        this.vertices[k++] = 0;
      }
    }

    k = 0;
    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = ix + iy * (widthSegments + 1);
        const b = a + 1;
        const c = a + widthSegments + 1;
        const d = c + 1;
        this.indices[k++] = a;
        this.indices[k++] = b;
        this.indices[k++] = c;
        this.indices[k++] = c;
        this.indices[k++] = b;
        this.indices[k++] = d;
      }
    }
    this.initializeObject();
  }
  protected generateNormals() {
    if (!this.wireframe) {
      this.normals = new Float32Array(this.vertices.length);
      for (let i = 0; i < this.vertices.length; i += 3) {
        this.normals[i] = 0;
        this.normals[i + 1] = 0;
        this.normals[i + 2] = 1;
      }
    }
  }
}

export default Plane;
