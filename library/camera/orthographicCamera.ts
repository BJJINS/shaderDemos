import { Mat, mat4x4 } from "../math/matrix";
import { scaleM, translateM } from "../math/transform";
import { Vec, vec3 } from "../math/vec";

interface OrthographicCamera {
  position?: Vec3;
  target?: Vec3;
  left?:number;
  right?:number;
  bottom?:number;
  top?:number;
  near?:number;
  far?:number;
}
const orthographicCamera = (param?: OrthographicCamera) => {
  const { normalize, cross, sub, negate, dot, clone } = Vec;
  let {
    position = vec3(),
    target = vec3(0, 0, -1),
    left = -1,
    right = 1,
    bottom = -1,
    top = 1,
    near = 0,
    far = 2,
  } = param || {};
  const up = vec3(0, 1, 0);
  position = clone(position);
  target = clone(target);

  let v = normalize(sub(target, position));
  const r = normalize(cross(v, up));
  const u = normalize(cross(r, v));
  v = negate(v);

  const viewMatrix = mat4x4([
    r.x,r.y,r.z,-dot(position, r),
    u.x,u.y,u.z,-dot(position, u),
    v.x,v.y,v.z,-dot(position, v),
    0,0,0,1
  ]);

  const translate = translateM(-(right + left) * 0.5, -(top + bottom) * 0.5, (far + near) * 0.5);
  const scale = scaleM(2/(right - left), 2/(top - bottom), -2/(far - near));

  return {
    viewMatrix,
    projectionMatrix: Mat.mult(scale, translate)
  }
};

export default orthographicCamera;