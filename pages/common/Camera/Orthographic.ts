import { Vec3 } from "../Vector";
import Camera from "./Camera";

class OrthographicCamera extends Camera {
  position = new Vec3(0, 0, 0);
  constructor() {
    super("orthographic");
  }
  lookAt(target: Vec3) {
    target.sub(this.position).normalize();
    const n = target;
    const up = new Vec3(0, 1, 0);
    const v = n.cross(up);
    const u= v.cross(n);
    return [
    

    ]
  }
}

export default OrthographicCamera;
