import createColor from "../color";

interface MeshBasicMaterialOptions {
  color?: Vec3;
}

// 不受光照影响
const meshBasicMaterial = (options?: MeshBasicMaterialOptions): Material => {
  const { color = createColor("#FF0000") } = options || {};
  return {
    color,
  };
};
export default meshBasicMaterial;
