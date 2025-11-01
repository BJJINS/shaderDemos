import BlinnPhongLight from "./index";

class PointLight extends BlinnPhongLight {
  constructor() {
    super("point");
    this.position.scale(2);
    this.la.set(0.2, 0.2, 0.2);
  }
}

export default PointLight;