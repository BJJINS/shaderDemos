type LightType = "directional" | "point" | "spot" | "ambient";

class Light {
  type: LightType;
  constructor(type: LightType) {
    this.type = type;
  }
}
    

export default Light;