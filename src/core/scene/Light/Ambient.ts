import { Vec3, Vec4 } from "@core/math/Vector";
import Light from "./Light";

class AmbientLight extends Light {
    color: Vec3 | Vec4;
    intensity: number;
    constructor(color: Vec3 | Vec4, intensity: number) {
        super("ambient");
        this.color = color;
        this.intensity = intensity;
    }
}


export default AmbientLight;