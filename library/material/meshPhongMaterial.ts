import createColor from "../color";

interface PhongMaterialOptions {
  color?: Vec3;
  shininess?: number;
}
const phongMaterial = (options?: PhongMaterialOptions) => {
  const { color = createColor("#FF0000"), shininess = 100 } = options || {};

  return {
    color,
    shininess
  };
};

export default phongMaterial;