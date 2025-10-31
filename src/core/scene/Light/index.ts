import { Vec3, Vec4 } from "@core/math/Vector";

type LightType = "directional" | "point" | "spot";

class BlinnPhongLight {
  position = new Vec3(1, 1, 1);
  shininess = 100;

  la = new Vec4(1, 1, 1, 1); // 环境光颜色
  ld = new Vec4(1, 1, 1, 1); // 漫反射颜色
  ls = new Vec4(1, 1, 1, 1); // 高光颜色

  type: LightType;
  constructor(type: LightType) {
    this.type = type;
  }
}


export const isLight = (obj: any): obj is BlinnPhongLight => {
  return obj.type === "directional" || obj.type === "point" || obj.type === "spot";
}

export default BlinnPhongLight;
