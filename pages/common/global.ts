import type { OrthographicCamera } from "./Camera";

interface Global {
  gl?: WebGL2RenderingContext;
  camera?: OrthographicCamera;
}

const global: Global = {};

export default global;