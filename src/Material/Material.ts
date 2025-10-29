import { Vec4 } from "@core/math/Vector";

class Material {
  color = new Vec4(1, 0, 0, 1);
  type: string;
  constructor(type: string) {
    this.type = type;
  }
}

export const NormalMaterial = new Material("normal");

export default Material;
