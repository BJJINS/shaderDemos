import { Vec3 } from "@core/math/Vector";

interface Param {
  position?: Vec3;
  color?: Vec3;
  intensity?: number;
}

class PointLight {
  position = new Vec3(1, 1, 1);
  color = new Vec3(1, 1, 1);
  intensity = 1;
  constructor(param: Param) {
    const { position, color, intensity } = param;
    if (position) this.position = position;
    if (color) this.color = color;
    if (intensity) this.intensity = intensity;
  }
}

export default PointLight;
