import type OrthographicCamera from "@core/camera/Orthographic";

interface MeshOptions {
  geometry: Geometry;
  material: Material;
  wireframe?: boolean;
  camera?: OrthographicCamera;
}
const mesh = (options: MeshOptions) => {
  
};


export default mesh;