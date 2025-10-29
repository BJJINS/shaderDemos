import { Vec3 } from "@core/math/Vector";

interface Param {
    position?: Vec3;
    color?: Vec3;
    intensity?: number;
}
class DirectionLight {
    position: Vec3;
    color: Vec3;
    intensity: number;
    constructor(param: Param) {
        const { position = new Vec3(1, 1, 1), color = new Vec3(1, 1, 1), intensity = 1 } = param;
        this.position = position;
        this.color = color;
        this.intensity = intensity;
    }
}

export default DirectionLight;
