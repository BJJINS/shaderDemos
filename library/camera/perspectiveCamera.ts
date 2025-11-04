import { Vec, vec3, type Vec3 } from "../math/vec";
interface PerspectiveCamera {
  position?: Vec3;
  target?: Vec3;
  up?: Vec3;
}

const perspectiveCamera = (param?: PerspectiveCamera) => {
  const { clone } = Vec;
  let { position = vec3(), target = vec3(0, 0, -1), up = vec3(0, 1, 0) } = param || {};
  position = clone(position);
  target = clone(target);
  up = clone(up);
};

export default perspectiveCamera;
