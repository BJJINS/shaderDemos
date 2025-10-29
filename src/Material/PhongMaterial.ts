import { Vec4 } from "@core/math/Vector";
import Material from "./Material";


class PhongMaterial extends Material{
  Ka = new Vec4(1, 1, 1, 1); // 材质的环境反射系数 Ka（RGBA）。决定环境光作用下的底色。这里 (1.0, 0.0, 1.0, 1.0) 偏紫色。
  Kd = new Vec4(1, 1, 1, 1); // 材质的漫反射反射系数 Kd（RGBA）。决定漫反射光作用下的颜色。这里 (1.0, 0.0, 1.0, 1.0) 偏紫色。
  Ks = new Vec4(1, 1, 1, 1); // 材质的镜面反射系数 Ks（RGBA）。决定镜面反射光作用下的颜色。这里 (1.0, 0.0, 1.0, 1.0) 偏紫色。
  shininess = 100; // 高光指数。数值越大，高光越小越锐利；越小，高光越大越柔和。此处 100.0 表示较锐利的高光。
  constructor() {
    super("phong");
  }
}

export default PhongMaterial;
