import { Vec4 } from "@core/math/Vector";

class Material {
  color = new Vec4(1, 0, 0, 1);
  ambient = new Vec4(1.0, 0.0, 1.0, 1.0);
  diffuse = new Vec4(1.0, 0.8, 0, 1.0);
  specular = new Vec4(1.0, 0.8, 1.0, 1.0);
  shininess = 100;
  type: string;
  constructor(type: string) {
    this.type = type;
  }
}

export const NormalMaterial = new Material("normal");

export default Material;
