import global from "@core/gl/global";
import { Vec3, Vec4 } from "@core/math/Vector";

class BlinnPhongLight {
  position = new Vec3(1, 1, 1);
  intensity = 1;

  la = new Vec4(1, 1, 1, 1); // 环境光颜色
  ld = new Vec4(1, 1, 1, 1); // 漫反射颜色
  ls = new Vec4(1, 1, 1, 1); // 高光颜色

  type: string;
  constructor(type: string) {
    this.type = type;
    global.lights.push(this);
  }
}

export default BlinnPhongLight;
